import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, FilePlus2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createReport } from '../../api/reportService';
import { useAuth } from '../../context/AuthContext';
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
      formData.append('predicted_diagnostic', predictionResult.prediction);

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
        formData.append('observations', comments);
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
    <div className='' id='webcrumbs'>
      <div className="w-[1200px] p-6 font-['Open_Sans',_sans-serif] text-dark-primary mx-auto">
        {/* Header */}
        <header className='flex items-center justify-center mb-8'>
          <div className='bg-green-200 p-2 rounded-full mr-3'>
            <CheckCircle className='h-5 w-5 text-green-800' />
          </div>
          <h1 className='text-[50px] font-bold text-very-dark-secondary'>
            {t('analysis.results')}
          </h1>
        </header>

        {/* Main Card */}
        <div className='bg-white rounded-xl shadow-md p-8 mb-8 transition-all duration-300 hover:shadow-lg'>
          {/* Diagnosis Header */}
          <div className='text-center mb-8'>
            <p className='text-light-primary mb-2'>
              {t('analysis.primary_diagnosis')}
            </p>
            <h2 className='text-3xl font-bold text-primary'>
              {getTranslatedDiagnosis(predictionResult.prediction) ||
                t('analysis.unknown')}
            </h2>
          </div>

          {/* Grid: Image and Probabilities */}
          <div className='grid md:grid-cols-2 gap-8 mb-8'>
            {/* Uploaded Image */}
            <div className='transition-all duration-500 opacity-0 animate-[fadeIn_1s_ease_forwards]'>
              <div className='bg-very-light-gray p-4 rounded-xl border border-light-gray shadow-sm h-full'>
                <h3 className='font-bold mb-4 text-dark-primary'>
                  {t('analysis.original_image')}
                </h3>
                <div className='overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-transform'>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt='Medical OCT Scan'
                    className='w-full h-64 object-cover'
                  />
                </div>
              </div>
            </div>

            {/* Probabilities */}
            <div className='transition-all duration-500 opacity-0 animate-[fadeIn_1.2s_ease_forwards]'>
              <div className='bg-very-light-gray p-4 rounded-xl border border-light-gray shadow-sm h-full'>
                <h3 className='font-bold mb-6 text-dark-primary'>
                  {t('analysis.probabilities')}
                </h3>
                <div className='space-y-5'>
                  {categories.map((category, index) => (
                    <div key={index}>
                      <div className='flex justify-between mb-1'>
                        <span>{category.name}</span>
                        <span className='font-semibold text-secondary'>
                          {category.value}%
                        </span>
                      </div>
                      <div className='h-4 w-full bg-light-gray rounded-full overflow-hidden'>
                        <div className='h-4 w-full bg-light-gray rounded-full overflow-hidden'>
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Description/Observations */}
          <div className='transition-all duration-500 opacity-0 animate-[fadeIn_1.4s_ease_forwards]'>
            <div className='bg-very-light-gray p-6 rounded-xl border border-light-gray shadow-sm mb-8'>
              <h3 className='font-bold mb-4 text-dark-primary'>
                {isPatient()
                  ? t('analysis.description')
                  : t('analysis.observations')}
              </h3>

              {isPatient() ? (
                <div className='bg-white p-4 rounded-lg border border-light-gray'>
                  <p className='text-dark-primary text-justify'>
                    {t(`diagnoses.description.${predictionResult.prediction}`, {
                      defaultValue: t('analysis.no_description_available'),
                    })}
                  </p>
                </div>
              ) : (
                <textarea
                  className='w-full p-4 border bg-white border-light-gray rounded-lg h-32 focus:ring-4 focus:ring-light-secondary 
                            focus:border-transparent outline-none transition-all duration-300'
                  placeholder={t('analysis.comments_placeholder')}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              )}
            </div>
          </div>

          {/* Generate Report Button */}
          <div className='flex justify-center mt-8 transition-all duration-500 opacity-0 animate-[fadeIn_1.6s_ease_forwards]'>
            {isPatient ? (
              <button
                onClick={handleDownload}
                className='px-6 gap-2 py-3 bg-dark-secondary hover:bg-accent-hover text-white rounded-lg transition-all duration-300 
        shadow-md hover:shadow-lg transform hover:scale-105 flex items-center'
              >
                <FilePlus2 className='w-6 h-6' />
                {t('analysis.download_report')}
              </button>
            ) : (
              <button
                onClick={handleGenerateReport}
                className='px-6 gap-2 py-3 bg-dark-secondary hover:bg-accent-hover text-white rounded-lg transition-all duration-300 
        shadow-md hover:shadow-lg transform hover:scale-105 flex items-center'
              >
                <FilePlus2 className='w-6 h-6' />
                {t('analysis.save_report')}
              </button>
            )}
          </div>
        </div>

        {/* Tailwind Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes progressBar {
            from {
              width: 0;
            }
            to {
              width: var(--width);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Analysis;
