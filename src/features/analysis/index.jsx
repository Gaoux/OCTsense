import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, FilePlus2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createReport } from '../../api/reportService';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

const Analysis = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { imageFile, predictionResult } = location.state || {};
  const [progressAnimated, setProgressAnimated] = useState(false);
  const [comments, setComments] = useState('');
  const { isPatient } = useAuth();

  const categories = [
    {
      name: t('analysis.category1') || 'CNV',
      value: predictionResult
        ? (predictionResult.probabilities[0] * 100).toFixed(0)
        : 0,
    },
    {
      name: t('analysis.category2') || 'DME',
      value: predictionResult
        ? (predictionResult.probabilities[1] * 100).toFixed(0)
        : 0,
    },
    {
      name: t('analysis.category3') || 'DRUSEN',
      value: predictionResult
        ? (predictionResult.probabilities[2] * 100).toFixed(0)
        : 0,
    },
    {
      name: t('analysis.category4') || 'NORMAL',
      value: predictionResult
        ? (predictionResult.probabilities[3] * 100).toFixed(0)
        : 0,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setProgressAnimated(true), 100); // slight delay
    return () => clearTimeout(timer);
  }, []);

  const getTranslatedDiagnosis = (diagnosisCode) => {
    return t(`diagnoses.${diagnosisCode}`, {
      defaultValue: diagnosisCode, // Fallback si no hay traducción
    });
  };

  const handleGenerateReport = async () => {
    if (!imageFile || !predictionResult) {
      console.error('Missing data to generate report.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append(
        'predicted_diagnostic',
        t(`diagnoses.${predictionResult.prediction}`)
      );
      
      const probabilitiesLabeled = {
        CNV: predictionResult.probabilities[0],
        DME: predictionResult.probabilities[1],
        DRUSEN: predictionResult.probabilities[2],
        Normal: predictionResult.probabilities[3],
      };

      formData.append(
        'diagnostic_probabilities',
        JSON.stringify(probabilitiesLabeled)
      );

      // Añadir descripción automática si es paciente
      if (isPatient()) {
        const autoDescription = t(
          `diagnoses.description.${predictionResult.prediction}`,
          {
            defaultValue: t('analysis.no_description_available'),
          }
        );
        formData.append('description', autoDescription);
      } else {
        // Añadir observaciones del profesional
        formData.append('comments', comments);
      }

      const response = await createReport(formData);

      if (response && response.data.id) {
        navigate(`/report/${response.data.id}`);
      } else {
        console.error('No report ID returned from server.');
      }
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleDownload = () => {
    if (!imageFile || !predictionResult) {
      console.error('Missing data to download report.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;

      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text(t('analysis.results') || 'OCT Report', 14, 20);

      // Timestamp
      const now = new Date();
      const formattedDate = now.toLocaleString();
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(
        `${t('analysis.generated_on') || 'Generated on'}: ${formattedDate}`,
        14,
        28
      );

      // Primary diagnosis
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`${t('analysis.primary_diagnosis')}:`, 14, 40);
      doc.setFont('Helvetica', 'bold');
      doc.text(getTranslatedDiagnosis(predictionResult.prediction), 18, 48);
      doc.setFont('Helvetica', 'normal');

      // Image
      doc.setFontSize(12);
      doc.text(t('analysis.original_image') + ':', 14, 58);
      doc.addImage(imageData, 'JPEG', 14, 62, 90, 60); // adjust size as needed

      let y = 130; // new section after image

      // Probabilities
      doc.text(t('analysis.probabilities') + ':', 14, y);
      y += 10;
      const probabilities = [
        {
          label: t('analysis.category1') || 'CNV',
          value: predictionResult.probabilities[0],
        },
        {
          label: t('analysis.category2') || 'DME',
          value: predictionResult.probabilities[1],
        },
        {
          label: t('analysis.category3') || 'DRUSEN',
          value: predictionResult.probabilities[2],
        },
        {
          label: t('analysis.category4') || 'NORMAL',
          value: predictionResult.probabilities[3],
        },
      ];

      probabilities.forEach(({ label, value }) => {
        doc.text(`- ${label}: ${(value * 100).toFixed(2)}%`, 18, y);
        y += 10;
      });

      // Description or Comments
      y += 10;
      if (isPatient()) {
        doc.text(`${t('analysis.description')}:`, 14, y);
        y += 8;
        const description = t(
          `diagnoses.description.${predictionResult.prediction}`,
          {
            defaultValue: t('analysis.no_description_available'),
          }
        );
        doc.text(description, 18, y, { maxWidth: 170 });
      } else {
        doc.text(`${t('analysis.observations')}:`, 14, y);
        y += 8;
        doc.text(comments || t('analysis.no_description_available'), 18, y, {
          maxWidth: 170,
        });
      }

      doc.save('oct_report.pdf');
    };

    reader.readAsDataURL(imageFile);
  };

  if (!imageFile || !predictionResult) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div className='bg-very-dark-secondary p-10 rounded-xl mb-4'>
          <h2 className='text-2xl font-bold text-very-light-gray'>
            {t('analysis.no_data_found')}
          </h2>
          <p className='text-accent mt-2 text-center'>
            {t('analysis.upload_first')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8 px-4 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className='max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden'
      >
        {/* Header */}
        <div className='bg-very-dark-secondary px-6 py-4'>
          <div className='flex items-center justify-center gap-3'>
            <div className='bg-green-200 p-2 rounded-full'>
              <CheckCircle className='h-5 w-5 text-green-800' />
            </div>
            <h1 className='text-2xl md:text-4xl font-bold text-white'>
              {t('analysis.results')}
            </h1>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className='p-4 md:p-8 space-y-6'>
          {/* Diagnosis Header */}
          <div className='text-center'>
            <p className='text-light-primary mb-2 text-sm md:text-base'>
              {t('analysis.primary_diagnosis')}
            </p>
            <h2 className='text-xl md:text-3xl font-bold text-primary'>
              {getTranslatedDiagnosis(predictionResult.prediction) ||
                t('analysis.unknown')}
            </h2>
          </div>

          {/* Grid: Image and Probabilities - Cambiado a columna en móvil */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Uploaded Image */}
            <div className='opacity-100'>
              <div className='bg-very-light-gray p-4 rounded-xl border border-light-gray shadow-sm h-full'>
                <h3 className='font-bold mb-4 text-dark-primary text-sm md:text-base'>
                  {t('analysis.original_image')}
                </h3>
                <div className='overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-transform'>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt='Medical OCT Scan'
                    className='w-full h-auto md:h-64 object-cover'
                  />
                </div>
              </div>
            </div>

            {/* Probabilities */}
            <div className='opacity-100'>
              <div className='bg-very-light-gray p-4 rounded-xl border border-light-gray shadow-sm h-full'>
                <h3 className='font-bold mb-4 md:mb-6 text-dark-primary text-sm md:text-base'>
                  {t('analysis.probabilities')}
                </h3>
                <div className='space-y-3 md:space-y-5'>
                  {categories.map((category, index) => (
                    <div key={index}>
                      <div className='flex justify-between mb-1 text-xs md:text-sm'>
                        <span>{category.name}</span>
                        <span className='font-semibold text-secondary'>
                          {category.value}%
                        </span>
                      </div>
                      <div className='h-3 md:h-4 w-full bg-light-gray rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-secondary rounded-full transition-all duration-1000 ease-out'
                          style={{
                            width: progressAnimated
                              ? `${category.value}%`
                              : '0%',
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Description/Observations */}
          <div className='opacity-100'>
            <div className='bg-very-light-gray p-4 md:p-6 rounded-xl border border-light-gray shadow-sm'>
              <h3 className='font-bold mb-3 md:mb-4 text-dark-primary text-sm md:text-base'>
                {isPatient()
                  ? t('analysis.description')
                  : t('analysis.observations')}
              </h3>

              {isPatient() ? (
                <div className='bg-white p-3 md:p-4 rounded-lg border border-light-gray'>
                  <p className='text-dark-primary text-justify text-xs md:text-sm'>
                    {t(`diagnoses.description.${predictionResult.prediction}`, {
                      defaultValue: t('analysis.no_description_available'),
                    })}
                  </p>
                </div>
              ) : (
                <textarea
                  className='w-full p-3 md:p-4 border bg-white border-light-gray rounded-lg h-24 md:h-32 text-xs md:text-sm focus:ring-2 focus:ring-light-secondary 
                        focus:border-transparent outline-none transition-all duration-300'
                  placeholder={t('analysis.comments_placeholder')}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              )}
            </div>
          </div>

          {/* Generate Report Button */}
          <div className='flex justify-center opacity-100'>
            {isPatient() ? (
              <button
                onClick={handleDownload}
                className='px-4 md:px-6 gap-2 py-2 md:py-3 bg-dark-secondary hover:bg-accent-hover text-white rounded-lg transition-all duration-300 
            shadow-md hover:shadow-lg transform hover:scale-105 flex items-center text-sm md:text-base'
              >
                <FilePlus2 className='w-4 h-4 md:w-6 md:h-6' />
                {t('analysis.download_report')}
              </button>
            ) : (
              <button
                onClick={handleGenerateReport}
                className='px-4 md:px-6 gap-2 py-2 md:py-3 bg-dark-secondary hover:bg-accent-hover text-white rounded-lg transition-all duration-300 
            shadow-md hover:shadow-lg transform hover:scale-105 flex items-center text-sm md:text-base'
              >
                <FilePlus2 className='w-4 h-4 md:w-6 md:h-6' />
                {t('analysis.save_report')}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analysis;
