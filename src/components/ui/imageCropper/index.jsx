import { useRef, useState, useEffect } from 'react';
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import setCanvasPreview from '../../../utils/cropUtils';
import CancelBtn from '../cancelBtn';
import ConfirmBtn from '../confirmBtn';

const ASPECT_RATIO = undefined; // Freeform crop
const MIN_DIMENSION = 150;

const ImageCropper = ({
  closeModal,
  updateImage,
  imageFile: defaultImageFile,
}) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState({
    unit: '%',
    x: 10,
    y: 10,
    width: 50,
    height: 50,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultImageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result?.toString() || '';
        setImgSrc(imageUrl);
      };
      reader.readAsDataURL(defaultImageFile);
    }
  }, [defaultImageFile]);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const minCropWidthPercent = (MIN_DIMENSION / width) * 100;
    const minCropHeightPercent = (MIN_DIMENSION / height) * 100;

    const crop = {
      unit: '%',
      x: 25,
      y: 25,
      width: Math.max(minCropWidthPercent, 30),
      height: Math.max(minCropHeightPercent, 30),
    };

    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleCrop = () => {
    if (!imgRef.current || !previewCanvasRef.current) return;

    const pixelCrop = convertToPixelCrop(
      crop,
      imgRef.current.naturalWidth,
      imgRef.current.naturalHeight
    );

    setCanvasPreview(imgRef.current, previewCanvasRef.current, pixelCrop);
    previewCanvasRef.current.toBlob((blob) => {
      const file = new File([blob], 'cropped.jpeg', { type: 'image/jpeg' });
      updateImage(file);
      closeModal();
    }, 'image/jpeg');
  };

  return (
    <div className='w-full flex flex-col items-center justify-center p-4 bg-gray-900 text-white'>
      {error && <p className='text-red-400 text-xs mb-2'>{error}</p>}
      {imgSrc && (
        <div className='w-full max-w-4xl flex justify-center'>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={ASPECT_RATIO}
            keepSelection
            className='w-full max-w-full'
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt='To crop'
              onLoad={onImageLoad}
              className='max-h-[80vh] object-contain mx-auto'
            />
          </ReactCrop>
        </div>
      )}
      <p className='text-sm text-gray-400 mt-4'>
        Drag the corners to adjust the crop area. You can also move the crop
        area around.
      </p>
      <p className='text-sm text-gray-400'>
        Minimum crop size: {MIN_DIMENSION}px
      </p>
      <div className='w-full flex justify-center items-center mt-4 gap-4'>
        <CancelBtn onClick={closeModal} />
        <ConfirmBtn onClick={handleCrop} text={'Crop image'} />
      </div>
      <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ImageCropper;
