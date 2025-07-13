import React from 'react';
import { Button } from 'primereact/button';

const ShareButtons = ({ url }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="flex gap-2 mt-2">
      <Button
        icon="pi pi-facebook"
        className="p-button-sm p-button-rounded p-button-info"
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')}
        tooltip="Share on Facebook"
      />
      <Button
        icon="pi pi-twitter"
        className="p-button-sm p-button-rounded p-button-secondary"
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check this out!`, '_blank')}
        tooltip="Share on Twitter"
      />
      <Button
        icon="pi pi-copy"
        className="p-button-sm p-button-rounded p-button-success"
        onClick={handleCopy}
        tooltip="Copy Link"
      />
    </div>
  );
};

export default ShareButtons;
