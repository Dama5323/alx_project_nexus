import React from 'react';
import { useQuery } from '@apollo/client';
import { Modal } from '../common/Modal';
import { Avatar } from '../common/Avatar';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { GET_VIEWERS_LIST } from '../../graphql/queries/analyticsQueries';
import { formatRelativeTime } from '../../utils/helpers/dateFormatter';
import './ViewersModal.css';

export interface ViewersModalProps {
  postId: string;
  onClose: () => void;
}

export const ViewersModal: React.FC<ViewersModalProps> = ({ postId, onClose }) => {
  const { data, loading, error, fetchMore } = useQuery(GET_VIEWERS_LIST, {
    variables: {
      postId,
      first: 20,
    },
  });

  const viewers = data?.postViewers?.edges || [];
  const hasMore = data?.postViewers?.pageInfo?.hasNextPage;

  const handleLoadMore = () => {
    if (!hasMore || loading) return;

    fetchMore({
      variables: {
        after: data.postViewers.pageInfo.endCursor,
      },
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Viewers (${data?.postViewers?.totalCount || 0})`}
      size="md"
    >
      <div className="viewers-modal">
        {loading && viewers.length === 0 ? (
          <div className="viewers-modal__loading">
            <LoadingSpinner size="md" />
          </div>
        ) : error ? (
          <div className="viewers-modal__error">
            <p>Failed to load viewers</p>
          </div>
        ) : viewers.length === 0 ? (
          <div className="viewers-modal__empty">
            <p>No viewers yet</p>
          </div>
        ) : (
          <>
            <div className="viewers-modal__list">
              {viewers.map((edge: any) => {
                const viewer = edge.node;
                return (
                  <div key={viewer.user.id} className="viewers-modal__viewer">
                    <Avatar
                      src={viewer.user.avatar}
                      alt={viewer.user.name}
                      size="md"
                      verified={viewer.user.verified}
                      fallback={viewer.user.name}
                    />
                    <div className="viewers-modal__viewer-info">
                      <div className="viewers-modal__viewer-name">
                        {viewer.user.name}
                        {viewer.user.verified && (
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path
                              fill="#1DA1F2"
                              d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="viewers-modal__viewer-username">
                        @{viewer.user.username}
                      </div>
                    </div>
                    <div className="viewers-modal__viewer-time">
                      {formatRelativeTime(viewer.viewedAt)}
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="viewers-modal__load-more">
                <button onClick={handleLoadMore} disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" /> : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};