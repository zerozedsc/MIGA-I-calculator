import React from 'react';

interface InfoSectionProps {
  t: any;
}

const InfoSection: React.FC<InfoSectionProps> = ({ t }) => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-sm text-blue-900">
      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        {t.infoTitle}
      </h3>
      <ul className="list-disc list-inside space-y-2 ml-1">
        <li dangerouslySetInnerHTML={{ __html: t.infoStep1 }}></li>
        <li dangerouslySetInnerHTML={{ __html: t.infoStep2 }}></li>
        <li dangerouslySetInnerHTML={{ __html: t.infoStep3 }}></li>
      </ul>
      <p className="mt-4 text-xs text-blue-700">
        {t.infoNote}
      </p>
    </div>
  );
};

export default InfoSection;