import { useTranslation } from 'react-i18next';
import { Trash2, IdCard, Calendar, ArrowRight } from 'lucide-react';

const ReportCard = ({ report, onView, onDelete }) => {
  const { t } = useTranslation();

  const {
    patient_name,
    document_id,
    eye_side,
    predicted_diagnostic,
    comments,
    created_at,
  } = report;

  return (
    <div
      className='w-[380px] bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 group'
      onClick={() => onView(report)}
    >
      <div className='relative'>
        {/* Botón de eliminar */}
        <div className='absolute top-3 right-3 flex items-center gap-2'>
          <div className='bg-primary-100 text-primary-800 px-3 py-1 rounded-full font-medium text-sm'>
            {eye_side === 'OD' ? t('report.eyeRight') : t('report.eyeLeft')}
          </div>
          <button
            className='bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition-all duration-300 transform hover:scale-105'
            onClick={(e) => {
              e.stopPropagation();
              onDelete(report.id);
            }}
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>

        {/* Contenido principal */}
        <div className='p-5'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h3 className='text-xl font-semibold text-primary-700 mb-1 group-hover:text-primary-800 transition-colors'>
                {patient_name || t('report.unknownPatient')}
              </h3>
              <p className='text-sm text-gray-600 flex items-center gap-1'>
                <span className='material-symbols-outlined text-sm'>
                  <IdCard className='w-4 h-4' />
                </span>
                {document_id || t('report.noDocument')}
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <div>
              <h4 className='text-xs uppercase text-gray-500 font-medium'>
                {t('report.predictedDiagnosis')}
              </h4>
              <p className='text-gray-800 font-medium'>
                {predicted_diagnostic}
              </p>
            </div>

            <div>
              <h4 className='text-xs uppercase text-gray-500 font-medium'>
                {t('report.comments')}
              </h4>
              <p className='text-gray-700 text-sm line-clamp-2'>
                {comments || t('report.noComment')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='bg-gray-50 px-5 py-3 flex justify-between items-center'>
          <p className='text-xs text-gray-500 flex items-center gap-1'>
            <span className='material-symbols-outlined text-sm'>
              <Calendar className='w-4 h-4' />
            </span>
            {new Date(created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <button className='text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors flex items-center gap-1'>
            {t('buttons.viewDetails')}
            <span className='material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform'>
              <ArrowRight className='w-4 h-4' />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
