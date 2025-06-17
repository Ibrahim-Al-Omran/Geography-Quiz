import React from 'react';
import styles from './FlagImage.module.css';

const FlagImage = ({ src, alt }) => {
  return (
    <div className={styles.flagContainer}>
      <img className={styles.flagImage} src={src} alt={alt} />
    </div>
  );
};

export default FlagImage;