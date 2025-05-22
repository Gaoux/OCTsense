import CancelBtn from '../cancelBtn';
import ImageCropper from '../imageCropper';

const Modal = ({ updateImage, closeModal, imageFile }) => {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm'
      aria-labelledby='crop-image-dialog'
      role='dialog'
      aria-modal='true'
    >
      <div className='relative w-[95%] sm:w-[80%] max-w-4xl bg-gray-800 text-slate-100 rounded-2xl shadow-xl p-5'>
        <button
          type='button'
          className='absolute top-3 right-3 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none'
          onClick={closeModal}
        >
          <span className='sr-only'>Close menu</span>
          &#x2715;
        </button>
        <ImageCropper
          updateImage={updateImage}
          closeModal={closeModal}
          imageFile={imageFile}
        />
      </div>
    </div>
  );
};

export default Modal;
