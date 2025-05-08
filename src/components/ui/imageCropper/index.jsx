import { useRef, useState, useEffect } from 'react';
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import setCanvasPreview from '../../../utils/cropUtils';

const ASPECT_RATIO = undefined; // Freeform crop
const MIN_DIMENSION = 150;

const ImageCropper = ({ closeModal, updateImage, imageFile }) => {
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
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result?.toString() || '';
        setImgSrc(imageUrl);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;

    // Calculate minimum crop width and height as percentages of the image size
    const minCropWidthPercent = (MIN_DIMENSION / width) * 100;
    const minCropHeightPercent = (MIN_DIMENSION / height) * 100;

    // Create the crop object
    const initialCrop = {
      unit: '%',
      x: 25,
      y: 25,
      width: Math.max(minCropWidthPercent, 20),
      height: Math.max(minCropHeightPercent, 20),
    };

    // No aspect ratio → skip makeAspectCrop
    const centeredCrop = centerCrop(initialCrop, width, height);
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
    <div className='w-full h-full p-4 flex flex-col items-center bg-gray-900 text-white'>
      {error && <p className='text-red-400 text-xs mb-2'>{error}</p>}
      {imgSrc && (
        <div className='w-full max-w-4xl h-[80vh] relative'>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={ASPECT_RATIO}
            keepSelection
            className='w-full h-full'
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt='To crop'
              onLoad={onImageLoad}
              className='object-contain max-h-full'
            />
          </ReactCrop>
        </div>
      )}
      <button
        onClick={handleCrop}
        className='mt-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-full'
      >
        Crop Image
      </button>

      <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ImageCropper;
