
import { Data } from 'types';

export const countLikes = (comments: Data[]) => {
  return comments.reduce((acc, comment) => acc + comment.likes, 0);
};

export const countComments = (comments: Data[]) => {
  return comments.length;
};
