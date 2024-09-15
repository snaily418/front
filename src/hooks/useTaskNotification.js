import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const useTaskNotification = () => {
  const categories = useSelector((state) => state.categories);
  const toast = useToast();

  useEffect(() => {
    const workCategory = categories.find(cat => cat.title === 'Работа');
    const personalCategory = categories.find(cat => cat.title === 'Личное');

    if (workCategory && personalCategory) {
      const workCompletedTasks = workCategory.tasks.filter(task => task.completed);
      const personalCompletedTasks = personalCategory.tasks.filter(task => task.completed);

      const today = new Date().toDateString();
      const lastRewardDateWork = localStorage.getItem('lastRewardDateWork');
      const lastRewardDatePersonal = localStorage.getItem('lastRewardDatePersonal');

      if (workCompletedTasks.length === 3 && (!lastRewardDateWork || lastRewardDateWork !== today)) {
        toast({
          title: "Поздравляю!",
          description: `Ты выполнил 3 задачи в папке "Работа" и получил 10 монет!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem('lastRewardDateWork', today);
      }

      if (personalCompletedTasks.length === 3 && (!lastRewardDatePersonal || lastRewardDatePersonal !== today)) {
        toast({
          title: "Поздравляю!",
          description: `Ты выполнил 3 задачи в папке "Личное" и получил 10 монет!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem('lastRewardDatePersonal', today);
      }
    }
  }, [categories, toast]);
};

export default useTaskNotification;