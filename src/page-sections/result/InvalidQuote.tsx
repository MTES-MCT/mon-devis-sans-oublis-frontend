'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import {
  Alert,
  AlertType,
  Badge,
  BadgeSize,
  BadgeVariant,
  QuoteErrorTable,
  QuoteStatusLink,
  QuoteStatusType,
} from '@/components';
import { useConseillerRoutes } from '@/hooks';
import { Category, ErrorDetails, Gestes } from '@/types';
import wording from '@/wording';

interface InvalidQuoteProps {
  analysisDate: string | null;
  comment: string;
  deleteErrorReasons?: { id: string; label: string }[];
  gestes: Gestes[];
  id: string;
  list: ErrorDetails[];
  onAddErrorComment?: (
    quoteCheckId: string,
    errorDetailsId: string,
    comment: string
  ) => void;
  onAddGlobalComment?: (quoteCheckId: string, comment: string) => void;
  onDeleteError?: (
    quoteCheckId: string,
    errorDetailsId: string,
    reason: string
  ) => void;
  onDeleteErrorComment?: (quoteCheckId: string, errorDetailsId: string) => void;
  onDeleteGlobalComment?: (quoteCheckId: string) => void;
  onHelpClick: (comment: string, errorDetailsId: string) => void;
  onOpenGlobalCommentModal: () => void;
  onUndoDeleteError?: (quoteCheckId: string, errorDetailsId: string) => void;
  uploadedFileName: string;
}

export default function InvalidQuote({
  analysisDate,
  comment,
  deleteErrorReasons,
  gestes,
  id,
  list,
  onAddErrorComment,
  onAddGlobalComment,
  onDeleteError,
  onDeleteErrorComment,
  onDeleteGlobalComment,
  onHelpClick,
  onOpenGlobalCommentModal,
  onUndoDeleteError,
  uploadedFileName,
}: InvalidQuoteProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment || '');

  const { isConseillerAndEdit } = useConseillerRoutes();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <section className='fr-container fr-gap-8'>
        <span className='flex flex-col md:flex-row items-center justify-between fr-mb-2w'>
          <div className='flex flex-col md:flex-row justify-between'>
            <div className='flex flex-col md:flex-row flex-wrap gap-4 items-center'>
              <h1 className='mb-0! text-center md:text-left'>
                {wording.page_upload_id.title}
              </h1>
            </div>
          </div>
          {analysisDate !== null && (
            <p className='bg-[var(--background-default-grey-hover)] mt-2! md:mt-0! mb-0! p-2 rounded-sm text-sm!'>
              {wording.page_upload_id.analysis_date.replace(
                '{date}',
                analysisDate
              )}
            </p>
          )}
        </span>
        <div className='flex flex-col items-center md:items-start'>
          <div className='flex flex-wrap gap-4 fr-mb-4w justify-center md:justify-start'>
            {uploadedFileName && (
              <Badge
                label={uploadedFileName}
                size={BadgeSize.SMALL}
                variant={BadgeVariant.BLUE_DARK}
              />
            )}
            <Badge
              label={(() => {
                const activeErrors = list.filter(
                  (error) => !error.deleted
                ).length;
                if (activeErrors === 0) {
                  return 'Tout est bon';
                }
                return (
                  activeErrors > 1
                    ? wording.page_upload_id.badge_correction_plural
                    : wording.page_upload_id.badge_correction
                ).replace('{number}', activeErrors.toString());
              })()}
              icon={
                list.filter((error) => !error.deleted).length === 0
                  ? 'fr-icon-success-fill'
                  : undefined
              }
              size={BadgeSize.SMALL}
              variant={
                list.filter((error) => !error.deleted).length === 0
                  ? BadgeVariant.GREEN_LIGHT
                  : BadgeVariant.GREY
              }
            />
          </div>
        </div>
        <Alert
          className='fr-pr-2w fr-mb-5w font-bold w-fit'
          description={wording.page_upload_id.quotation_alert_ko}
          type={AlertType.INFO}
        />
        {isConseillerAndEdit ? (
          comment && comment !== '' ? (
            <div className='flex flex-row p-6 rounded-lg bg-[var(--background-alt-grey)]'>
              <div>
                <Image
                  alt='delete'
                  className='object-contain'
                  height={64}
                  src='/images/quotation_results/quotation_correction_comment.webp'
                  width={64}
                />
              </div>
              <div className='px-6 w-full'>
                <h6 className='fr-mb-1w'>Votre commentaire général</h6>
                {isEditing ? (
                  <textarea
                    className='fr-input h-[150px] w-full'
                    disabled={!isEditing}
                    onChange={(e) => setEditedComment(e.target.value)}
                    value={editedComment}
                  />
                ) : (
                  <p>{comment}</p>
                )}
                {isEditing && (
                  <div className='flex justify-end gap-2 mt-2'>
                    <button
                      className='fr-btn fr-btn--secondary'
                      onClick={() => {
                        setIsEditing(false);
                        setEditedComment(comment || '');
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      className='fr-btn fr-btn--primary'
                      disabled={editedComment === comment}
                      onClick={() => {
                        onAddGlobalComment?.(id, editedComment);
                        setIsEditing(false);
                      }}
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>
              <div className='relative'>
                <button
                  ref={buttonRef}
                  className='fr-btn fr-btn--tertiary fr-btn--sm fr-icon-edit-line'
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    className='absolute right-0 mt-2 w-fit bg-white rounded-md shadow-lg z-10'
                  >
                    <ul className='m-0! p-0!'>
                      <li className='list-none whitespace-nowrap'>
                        <button
                          className='w-full px-4 py-3 text-left hover:bg-[var(--background-default-grey)] flex items-center gap-2'
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsEditing(true);
                          }}
                        >
                          Modifier le commentaire
                        </button>
                      </li>
                      <div className='border-t border-[var(--border-default-grey)] mx-3' />
                      <li className='list-none whitespace-nowrap'>
                        <button
                          className='w-full px-4 py-3 text-left hover:bg-[var(--background-default-grey)] text-[var(--text-default-error)] flex items-center gap-2'
                          onClick={() => {
                            setIsMenuOpen(false);
                            onDeleteGlobalComment?.(id);
                          }}
                        >
                          Supprimer le commentaire
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='flex flex-row gap-6 p-6 rounded-lg bg-[var(--background-alt-grey)] items-center w-fit'>
              <div>
                <Image
                  alt='delete'
                  height={64}
                  src='/images/quotation_results/quotation_correction_comment.webp'
                  width={64}
                />
              </div>
              <div>
                <h6 className='fr-mb-1w'>Ajouter un commentaire global</h6>
                <button
                  className='fr-btn fr-btn--tertiary fr-btn--sm bg-white! hover:bg-gray-100! active:bg-gray-200! fr-icon-chat-3-line fr-btn--icon-right'
                  onClick={onOpenGlobalCommentModal}
                >
                  Écrire le commentaire
                </button>
              </div>
            </div>
          )
        ) : null}
        {!isConseillerAndEdit && comment && comment !== '' ? (
          <div className='flex flex-row p-6 rounded-lg bg-[var(--background-alt-grey)]'>
            <div>
              <Image
                alt='delete'
                className='object-contain'
                height={64}
                src='/images/quotation_results/quotation_correction_comment.webp'
                width={64}
              />
            </div>
            <div className='pl-6 pr-2 w-full'>
              <h6 className='fr-mb-2w'>
                Commentaire général de votre conseiller
              </h6>
              <p>{comment}</p>
            </div>
          </div>
        ) : null}
      </section>
      <section className='fr-container'>
        <h3 className='fr-mt-5w text-center md:text-left'>
          {wording.page_upload_id.subtitle}
        </h3>
        <div className='flex flex-col gap-8'>
          <QuoteErrorTable
            category={Category.ADMIN}
            deleteErrorReasons={deleteErrorReasons}
            errorDetails={list}
            onAddErrorComment={(quoteCheckId, errorDetailsId, comment) =>
              onAddErrorComment?.(quoteCheckId, errorDetailsId, comment)
            }
            onDeleteError={(quoteCheckId, errorDetailsId, reason) =>
              onDeleteError?.(quoteCheckId, errorDetailsId, reason)
            }
            onDeleteErrorComment={(quoteCheckId, errorDetailsId) =>
              onDeleteErrorComment?.(quoteCheckId, errorDetailsId)
            }
            onHelpClick={onHelpClick}
            onUndoDeleteError={onUndoDeleteError}
            quoteCheckId={id}
          />
          <QuoteErrorTable
            category={Category.GESTES}
            deleteErrorReasons={deleteErrorReasons}
            errorDetails={list}
            gestes={gestes}
            onAddErrorComment={(quoteCheckId, errorDetailsId, comment) =>
              onAddErrorComment?.(quoteCheckId, errorDetailsId, comment)
            }
            onDeleteError={(quoteCheckId, errorDetailsId, reason) =>
              onDeleteError?.(quoteCheckId, errorDetailsId, reason)
            }
            onDeleteErrorComment={(quoteCheckId, errorDetailsId) =>
              onDeleteErrorComment?.(quoteCheckId, errorDetailsId)
            }
            onHelpClick={onHelpClick}
            onUndoDeleteError={onUndoDeleteError}
            quoteCheckId={id}
          />
        </div>
      </section>
      <section className='fr-container fr-my-6w'>
        <div className='flex md:flex-row flex-col gap-6 justify-between'>
          <QuoteStatusLink type={QuoteStatusType.SHARE} />
          <QuoteStatusLink
            className={isConseillerAndEdit ? 'md:w-[700px]!' : 'md:w-[480px]!'}
            type={QuoteStatusType.UPLOAD}
          />
        </div>
      </section>
    </>
  );
}
