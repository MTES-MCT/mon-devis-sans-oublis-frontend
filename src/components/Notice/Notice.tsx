export interface NoticeProps {
  className: string;
  description: string;
  title?: string;
}

export default function Notice({ className, description, title }: NoticeProps) {
  return (
    <div className={`fr-notice ${className}`}>
      <div className="fr-container">
        <div className="fr-notice__body">
          <span>
            <span className="fr-notice__title fr-icon-warning-fill">
              {title}
            </span>
            <span className="ml-0 md:ml-2 text-sm md:text-base">
              {description}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
