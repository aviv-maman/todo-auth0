import '@/styles/spinkit.css';

const SpinnerWave: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className='sk-wave'>
        <div className='sk-wave-rect'></div>
        <div className='sk-wave-rect'></div>
        <div className='sk-wave-rect'></div>
        <div className='sk-wave-rect'></div>
        <div className='sk-wave-rect'></div>
      </div>
    </div>
  );
};

export default SpinnerWave;
