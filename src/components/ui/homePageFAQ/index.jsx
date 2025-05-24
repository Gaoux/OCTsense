import { useTranslation } from 'react-i18next';

const HomePageFAQ = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('home.faq.questions.0.q'),
      answer: t('home.faq.questions.0.a'),
    },
    {
      question: t('home.faq.questions.1.q'),
      answer: t('home.faq.questions.1.a'),
    },
    {
      question: t('home.faq.questions.2.q'),
      answer: t('home.faq.questions.2.a'),
    },
    {
      question: t('home.faq.questions.3.q'),
      answer: t('home.faq.questions.3.a'),
    },
    {
      question: t('home.faq.questions.4.q'),
      answer: t('home.faq.questions.4.a'),
    },
  ];

  return (
    <section className='py-16 mb-20'>
      <div className='text-center mb-14'>
        <h2 className='text-3xl font-bold text-very-dark-secondary mb-4'>
          {t('home.faq.title')}
        </h2>
        <p className='text-lg text-primary max-w-3xl mx-auto'>
          {t('home.faq.description')}
        </p>
      </div>

      <div className='max-w-4xl mx-auto space-y-6'>
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className='bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden group transition-all duration-300 hover:shadow-lg'
          >
            <summary className='flex items-center justify-between p-6 cursor-pointer font-semibold text-base md:text-lg text-very-dark-secondary'>
              <span>{faq.question}</span>
              <svg
                className='w-5 h-5 text-blue-600 transform transition-transform duration-300 group-open:rotate-180'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </summary>
            <div className='p-6 pt-0 text-primary border-t border-gray-100 transition-all duration-300'>
              <p className='text-sm md:text-base'>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>

      {/* <div className='flex justify-center mt-10'>
        <button className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center'>
          <span>{t('home.faq.moreQuestions')}</span>
          <svg
            className='w-5 h-5 ml-2'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        </button>
      </div> */}
    </section>
  );
};

export default HomePageFAQ;
