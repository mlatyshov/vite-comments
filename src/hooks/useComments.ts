import { useQuery } from '@tanstack/react-query';
import getCommentsRequest from '../api/comments/getCommentsRequest';

export const useComments = (page: number) => {
  return useQuery({
    queryKey: ['comments', page],
    queryFn: () => getCommentsRequest(page),
    
    refetchOnWindowFocus: false,  //  предотвращает повторный запрос при переключении окна
  });
};
