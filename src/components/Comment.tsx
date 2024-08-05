import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { FaHeart } from 'react-icons/fa';
import authorsData from '../data/authors';

const HeartIcon = styled(FaHeart)<{ liked: boolean }>`
  color: ${props => (props.liked ? 'red' : 'transparent')}; /* Заполнение цветом при лайке */
  stroke: red; /* Цвет обводки */
  stroke-width: 40px; /* Толщина обводки */
  cursor: pointer;
  transition: color 0.3s ease, stroke 0.3s ease;

  &:hover {
    color: ${props => (props.liked ? '#ff4d4d' : 'transparent')}; /* Цвет при наведении */
    stroke: ${props => (props.liked ? '#ff4d4d' : 'red')}; /* Цвет обводки при наведении */
  }
`;

const CommentWrapper = styled.div<{ level: number }>`
  margin-left: ${(props) => props.level * 20}px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  /* Стили для узких экранов */
  @media (max-width: 600px) {
    margin-left: ${(props) => props.level * 10}px; /* Уменьшаем отступ для вложенных комментариев */
    padding: 5px;
  }
`;

const AvatarContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;

  /* Стили для узких экранов */
  @media (max-width: 600px) {
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover; /* Сохраняет пропорции и предотвращает искажения */

  /* Стили для узких экранов */
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
  }
`;

const CommentContent = styled.div`
  flex-grow: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TimeStamp = styled.div`
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
`;

const LikesWrapper = styled.div`
  display: flex;
  padding: 0 4px;
  align-items: center;
  margin-left: 20px; /* Отступ слева для отделения от текста */

  /* Стили для узких экранов */
  @media (max-width: 600px) {
    margin-left: 10px;
  }
`;

interface CommentProps {
  comment: {
    id: number;
    text: string;
    author: number;
    likes: number;
    created: string;
  };
  level?: number;
  onLikeChange: (id: number, isLiked: boolean) => void;
}



const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const difference = now.getTime() - commentDate.getTime();
  
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    if (hours < 12) {
      if (hours >= 1) {
        let hourLabel = 'часов назад';
        if (hours % 10 === 1 && hours !== 11) {
          hourLabel = 'час назад';
        } else if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours)) {
          hourLabel = 'часа назад';
        }
        return `${hours} ${hourLabel}`;
      } else if (minutes >= 1) {
        let minuteLabel = 'минут назад';
        if (minutes % 10 === 1 && minutes !== 11) {
          minuteLabel = 'минута назад';
        } else if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes)) {
          minuteLabel = 'минуты назад';
        }
        return `${minutes} ${minuteLabel}`;
      } else {
        let secondLabel = 'секунд назад';
        if (seconds % 10 === 1 && seconds !== 11) {
          secondLabel = 'секунда назад';
        } else if ([2, 3, 4].includes(seconds % 10) && ![12, 13, 14].includes(seconds)) {
          secondLabel = 'секунды назад';
        }
        return `${seconds} ${secondLabel}`;
      }
    } else {
      return commentDate.toLocaleString(); // Если прошло больше 12 часов, показываем обычное время
    }
  };
  
const Comment: React.FC<CommentProps> = ({ comment, level = 0, onLikeChange }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  useEffect(() => {
    const likedComments = JSON.parse(localStorage.getItem('likedComments') || '{}');
    if (likedComments[comment.id]) {
      setLiked(true);
      setLikesCount(comment.likes + 1);  // Учитываем лайк из localStorage при инициализации
    }
  }, [comment.id, comment.likes]);

  const handleLike = () => {
    const likedComments = JSON.parse(localStorage.getItem('likedComments') || '{}');

    if (liked) {
      delete likedComments[comment.id];
      setLikesCount(likesCount - 1);
    } else {
      likedComments[comment.id] = true;
      setLikesCount(likesCount + 1);
    }

    setLiked(!liked);
    localStorage.setItem('likedComments', JSON.stringify(likedComments));

    // Вызов функции пересчета общего количества лайков
    onLikeChange(comment.id, !liked);
  };

  const author = authorsData.find(author => author.id === comment.author);
  if (!author) return null;

  const relativeTime = getRelativeTime(comment.created); // Используем новую функцию для вычисления времени

  return (
    <CommentWrapper level={level}>
      <AvatarContainer>
        <Avatar src={author.avatar} alt={author.name} />
      </AvatarContainer>
      <CommentContent>
        <CommentHeader>
          <strong>{author.name}</strong>
          <LikesWrapper>
            <HeartIcon liked={liked}  style={{ width: '20px' }} onClick={handleLike} />
            <span style={{ marginLeft: '8px' }}>{likesCount}</span>
          </LikesWrapper>
        </CommentHeader>
        <TimeStamp>{relativeTime}</TimeStamp>
        <div>{comment.text}</div>
      </CommentContent>
    </CommentWrapper>
  );
};

export default Comment;
