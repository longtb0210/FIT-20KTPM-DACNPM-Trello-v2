import { User } from "@trello-v2/shared/src/schemas/User";

// Generate mock data for a single activity
const generateActivity = (index: number): any => {
  return {
    workspace_id: `workspace_${index}`,
    content: `Activity ${index}`,
    _id: `activity_${index}`,
    board_id: `board_${index}`,
    cardlist_id: `cardlist_${index}`,
    card_id: `card_${index}`
  };
};

// Generate mock data for a user
const generateUser = (): User => {
  const activitiesCount = 5; // You can change this to generate more or fewer activities
  const activities = Array.from({ length: activitiesCount }, (_, index) => generateActivity(index + 1));

  return {
    email: 'example@example.com',
    username: 'example_user',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    avatar: 'avatar_url',
    activities,
    workspace_ids: ['workspace_1', 'workspace_2'] // Example workspace IDs
  };
};

// Example usage
export const mockUser: User = generateUser();



export const activityData = [
  {
    workspace_id: 'wp_01',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  },
  {
    workspace_id: 'wp_01',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  },
  {
    workspace_id: 'wp_02',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  },
  {
    workspace_id: 'wp_01',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  },
  {
    workspace_id: 'wp_01',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  },
  {
    workspace_id: 'wp_02',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  },
  {
    workspace_id: 'wp_01',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  },
  {
    workspace_id: 'wp_01',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  },
  {
    workspace_id: 'wp_02',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  },
  {
    workspace_id: 'wp_01',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  },
  {
    workspace_id: 'wp_01',
    board_id: 1,
    cardlist_id: 'list1',
    card_id: 'Task1',
    content: 'Add comment'
  }
]
export const workspaceData = [
  {
    _id: 'wp_1',
    name: 'Workspace1',
    short_name: 'work',
    description: 'abcxyz',
    website: 'my website',
    logo: 'logo',
    type_id: 'type1',
    owner_email: '123@gmail.com',
    visibility: 'public',
    members_email: ['1@gmail.com', '2@gmail.com']
  },
  {
    _id: 'wp_2',
    name: 'Workspace2',
    short_name: 'work',
    description: 'abcxyz',
    website: 'my website',
    logo: 'logo',
    type_id: 'type1',
    owner_email: '123@gmail.com',
    visibility: 'private',
    members_email: ['1@gmail.com', '2@gmail.com']
  }
]
