import React, { useState, useEffect } from 'react';
import { useComments } from '../hooks/useComments';
import Comment from './Comment';
import styled from '@emotion/styled';
import { FaHeart } from 'react-icons/fa';
import { commentsPage1, commentsPage2, commentsPage3 } from '../data/comments';

const PageWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  text-align: left;
  opacity: ${(props: { isLoading: boolean }) => (props.isLoading ? 0 : 1)};
  transition: opacity 0.2s ease-in-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  color: white;
`;

const HeartIcon = styled(FaHeart)`
  color: gray;
  margin-right: 8px;
`;

const CommentsPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; /* Чтобы элементы были центрированы вертикально */
  min-height: 100vh;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 200px;
  height: 4px;
  background-color: #ccc;
  margin-bottom: 10px;
  overflow: hidden;
  position: fixed; /* Закрепляем прогресс-бар */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Центрируем по экрану */

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background-color: #4caf50;
    animation: load 1s infinite;
  }

  @keyframes load {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  width: 200px;
  margin: 20px auto;
  padding: 10px;
  background-color: #555;
  color: white;
  text-align: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444;
  }

  &:disabled {
    background-color: #888;
    cursor: not-allowed;
  }
`;

const CommentList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [loadingNextPage, setLoadingNextPage] = useState(false); // Для управления состоянием загрузки
  const [isRendered, setIsRendered] = useState(false); // Для контроля рендеринга
  const { data: commentsData, isLoading, error } = useComments(page);

  useEffect(() => {
    const allComments = [...commentsPage1.data, ...commentsPage2.data, ...commentsPage3.data];
    setTotalComments(allComments.length);

    // Пересчитываем лайки для всех страниц
    const allLikes = allComments.reduce((acc, comment) => acc + comment.likes, 0);

    // Учитываем лайки, которые пользователь добавил в localStorage
    const likedComments = JSON.parse(localStorage.getItem('likedComments') || '{}');
    const userLikes = Object.keys(likedComments).length;

    setTotalLikes(allLikes + userLikes);

    // Отключаем состояние загрузки после завершения загрузки данных
    if (!isLoading) {
      setLoadingNextPage(false);
      setIsRendered(true); // Рендеринг завершен
    }
  }, [commentsData, isLoading]);

  const handleLikeChange = (commentId: number, isLiked: boolean) => {
    const likedComments = JSON.parse(localStorage.getItem('likedComments') || '{}');

    if (isLiked) {
      likedComments[commentId] = true;
      setTotalLikes(prev => prev + 1);
    } else {
      delete likedComments[commentId];
      setTotalLikes(prev => prev - 1);
    }

    localStorage.setItem('likedComments', JSON.stringify(likedComments));
  };

  const handleLoadMore = () => {
    setLoadingNextPage(true);
    setIsRendered(false); // Скрываем кнопку во время загрузки
    setPage(prevPage => prevPage + 1);
  };

  const renderComments = (comments: any[], parentId: number | null = null, level: number = 0) => {
    return comments
      .filter(comment => comment.parent === parentId)
      .map(comment => (
        <div key={comment.id}>
          <Comment comment={comment} level={level} onLikeChange={handleLikeChange} />
          {renderComments(comments, comment.id, level + 1)}
        </div>
      ));
  };

  if (error) return <div>Опс, какая-то ошибка</div>;

  return (
    <CommentsPage className="comments-block">
      {loadingNextPage && <ProgressBar />} {}
      <PageWrapper isLoading={loadingNextPage}>
        {isRendered && !loadingNextPage && (
          <>
            <Header>
              <div>{totalComments} комментариев</div>
              <div>
                <HeartIcon />
                {totalLikes}
              </div>
            </Header>
            {renderComments(commentsData?.data || [])}
            <LoadMoreButton onClick={handleLoadMore} disabled={page >= commentsData?.pagination.total_pages}>
              Загрузить ещё
            </LoadMoreButton>
          </>
        )}
      </PageWrapper>
    </CommentsPage>
  );
};

export default CommentList;
