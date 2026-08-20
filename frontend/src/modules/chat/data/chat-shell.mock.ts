export const mockConversations = [
  {
    id: 1,
    name: "Minh Anh",
    email: "minhanh@example.com",
    lastMessage: "Chieu nay minh test socket nhe.",
    lastMessageAt: "13:40",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Product Room",
    email: "team@example.com",
    lastMessage: "Map mode de phase sau, nhung slot da co.",
    lastMessageAt: "12:18",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Dove Lab",
    email: "lab@example.com",
    lastMessage: "Auth phase da xong, gio dung layout.",
    lastMessageAt: "Hom qua",
    unread: 0,
    online: true,
  },
];

export const mockMessages = [
  {
    id: 1,
    sender: "Minh Anh",
    content: "Layout cu co khung tot, nhung nhin hoi cung.",
    time: "13:31",
    mine: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Minh se giu 3 cot, lam nhe hon va de gan query/socket.",
    time: "13:33",
    mine: true,
  },
  {
    id: 3,
    sender: "Minh Anh",
    content: "Nho de san tab map cho location sharing nha.",
    time: "13:40",
    mine: false,
  },
];

export const mockTopics = ["General", "Map", "Files"];
