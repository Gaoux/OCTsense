import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  FilePlus2,
  BarChart3,
  User,
  ClipboardList,
  Image,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createReport } from '../../api/reportService';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { generateSimplePDFReport } from '../../utils/pdfUtils';
import { ROUTES } from '../../constants/routes';
const Analysis = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { imageFile, predictionResult } = location.state || {};
  const [progressAnimated, setProgressAnimated] = useState(false);
  const [comments, setComments] = useState('');
  const { isPatient, user } = useAuth();
  const [patientName, setPatientName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [eyeSide, setEyeSide] = useState(''); // default
  const [visualAcuity, setVisualAcuity] = useState('');

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
        NORMAL: predictionResult.probabilities[3],
      };

      formData.append(
        'diagnostic_probabilities',
        JSON.stringify(probabilitiesLabeled)
      );
      console.log('isPatient:', isPatient());
      // Añadir descripción automática si es paciente
      if (isPatient()) {
        const autoDescription = t(
          `diagnoses.description.${predictionResult.prediction}`,
          {
            defaultValue: t('analysis.no_description_available'),
          }
        );
        formData.append('comments', autoDescription);
      } else {
        // Añadir observaciones del profesional
        formData.append('patient_name', patientName);
        formData.append('document_id', documentId);
        formData.append('eye_side', eyeSide);
        formData.append('visual_acuity', visualAcuity);
        formData.append('comments', comments);
      }
      const response = await createReport(formData);

      if (response && response.data.id) {
        navigate(`${ROUTES.REPORTS}/${response.data.id}`);
      } else {
        console.error('No report ID returned from server.');
      }
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleDownload = () => {
    console.log('Analysis downloading', predictionResult);
    generateSimplePDFReport({
      userData: {
        name: user.name,
        email: user.email,
      },
      imageFile,
      prediction: predictionResult.prediction,
      probabilities: categories,
      t,
    });
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
    <div className='min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden'
      >
        {/* Header */}
        <div className='bg-very-dark-secondary px-6 py-6'>
          <div className='flex items-center justify-center gap-3'>
            <div className='bg-white p-2 rounded-full shadow-md'>
              <CheckCircle className='h-6 w-6 text-very-dark-secondary' />
            </div>
            <h1 className='text-2xl md:text-3xl font-bold text-white'>
              {t('analysis.results')}
            </h1>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className='p-6 md:p-10 space-y-8'>
          {/* Diagnosis Header */}
          <div className='text-center bg-very-light-gray py-5 px-4 rounded-xl border border-light-gray shadow-sm'>
            <p className='text-light-primary mb-2 font-medium'>
              {t('analysis.primary_diagnosis')}
            </p>
            <h2 className='text-2xl md:text-3xl font-bold text-primary'>
              {getTranslatedDiagnosis(predictionResult.prediction) ||
                t('analysis.unknown')}
            </h2>
          </div>

          {/* Grid: Image and Probabilities */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Uploaded Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className='h-full'
            >
              <div className='bg-very-light-gray p-5 rounded-xl border border-light-gray shadow-md h-full'>
                <h3 className='font-bold mb-4 text-dark-primary flex items-center gap-2'>
                  <Image className='w-5 h-5 text-secondary' />
                  {t('analysis.original_image')}
                </h3>
                <div className='overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300'>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt='Medical OCT Scan'
                    className='w-full h-auto md:h-64 object-cover'
                  />
                </div>
              </div>
            </motion.div>

            {/* Probabilities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className='h-full'
            >
              <div className='bg-very-light-gray p-5 rounded-xl border border-light-gray shadow-md h-full'>
                <h3 className='font-bold mb-6 text-dark-primary flex items-center gap-2'>
                  <BarChart3 className='w-5 h-5 text-secondary' />
                  {t('analysis.probabilities')}
                </h3>
                <div className='space-y-5'>
                  {categories.map((category, index) => (
                    <div key={index}>
                      <div className='flex justify-between mb-2 text-sm'>
                        <span className='font-medium text-dark-primary'>
                          {category.name}
                        </span>
                        <span className='font-semibold text-secondary'>
                          {category.value}%
                        </span>
                      </div>
                      <div className='h-4 w-full bg-light-gray rounded-full overflow-hidden'>
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{
                            width: progressAnimated
                              ? `${category.value}%`
                              : '0%',
                          }}
                          transition={{
                            duration: 1.2,
                            ease: 'easeOut',
                            delay: 0.5 + index * 0.1,
                          }}
                          className='h-full bg-secondary rounded-full'
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Datos del paciente - Solo visible para médicos */}
          {!isPatient() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className='bg-white rounded-xl border border-light-gray shadow-md overflow-hidden'
            >
              <div className='bg-very-light-gray px-6 py-4 border-b border-light-gray'>
                <h3 className='font-bold text-dark-primary flex items-center gap-2'>
                  <User className='w-5 h-5 text-secondary' />
                  {t('analysis.patient_information')}
                </h3>
              </div>

              <div className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-dark-primary mb-2'>
                      {t('analysis.patient_name')}
                    </label>
                    <input
                      type='text'
                      className='border border-light-gray p-3 rounded-lg text-sm w-full focus:ring-2 focus:ring-light-secondary 
                  focus:border-transparent outline-none transition-all duration-300'
                      placeholder={t('analysis.patient_name')}
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-dark-primary mb-2'>
                      {t('analysis.document_id')}
                    </label>
                    <input
                      type='text'
                      className='border border-light-gray p-3 rounded-lg text-sm w-full focus:ring-2 focus:ring-light-secondary 
                  focus:border-transparent outline-none transition-all duration-300'
                      placeholder={t('analysis.document_id')}
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-dark-primary mb-2'>
                      {t('analysis.eye_side')}
                    </label>
                    <select
                      className='border border-light-gray p-3 rounded-lg text-sm w-full focus:ring-2 focus:ring-light-secondary 
  focus:border-transparent outline-none transition-all duration-300 bg-white'
                      value={eyeSide}
                      onChange={(e) => setEyeSide(e.target.value)}
                    >
                      <option value=''>{t('analysis.select_option')}</option>
                      <option value='OD'>{t('analysis.eye_od')}</option>
                      <option value='OS'>{t('analysis.eye_os')}</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-dark-primary mb-2'>
                      {t('analysis.visual_acuity')}
                    </label>
                    <input
                      type='text'
                      className='border border-light-gray p-3 rounded-lg text-sm w-full focus:ring-2 focus:ring-light-secondary 
                  focus:border-transparent outline-none transition-all duration-300'
                      placeholder={t('analysis.visual_acuity')}
                      value={visualAcuity}
                      onChange={(e) => setVisualAcuity(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Clinical Description/Observations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className='bg-white p-6 rounded-xl border border-light-gray shadow-md'
          >
            <h3 className='font-bold mb-4 text-dark-primary flex items-center gap-2'>
              <ClipboardList className='w-5 h-5 text-secondary' />
              {isPatient()
                ? t('analysis.description')
                : t('analysis.observations')}
            </h3>

            {isPatient() ? (
              <div className='bg-very-light-gray p-4 rounded-lg border border-light-gray'>
                <p className='text-dark-primary text-justify'>
                  {t(`diagnoses.description.${predictionResult.prediction}`, {
                    defaultValue: t('analysis.no_description_available'),
                  })}
                </p>
              </div>
            ) : (
              <textarea
                data-testid='comments-textarea'
                className='w-full p-4 border border-light-gray bg-white rounded-lg h-36 text-sm focus:ring-2 focus:ring-light-secondary 
                      focus:border-transparent outline-none transition-all duration-300'
                placeholder={t('analysis.comments_placeholder')}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              ></textarea>
            )}
          </motion.div>

          {/* Generate Report Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className='flex justify-center pt-4'
          >
            {isPatient() ? (
              <button
                onClick={handleDownload}
                className='px-8 py-3 bg-dark-secondary hover:bg-secondary
            text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl 
            transform  flex items-center gap-3 font-medium'
              >
                <FilePlus2 className='w-5 h-5' />
                {t('analysis.download_report')}
              </button>
            ) : (
              <button
                onClick={handleGenerateReport}
                className='px-8 py-3 bg-dark-secondary hover:bg-secondary
            text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl 
            transform flex items-center gap-3 font-medium'
                data-testid='save-report-button'
              >
                <FilePlus2 className='w-5 h-5' />
                {t('analysis.save_report')}
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analysis;
