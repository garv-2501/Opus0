interface Folder {
  name: string;
  chats: string[];
}

export const folders: Folder[] = [
  {
    name: "Work Projects",
    chats: ["Project Planning", "Code Review", "Team Meeting"],
  },
  {
    name: "Personal",
    chats: ["Travel Plans", "Shopping List"],
  },
];

export const recentChats = Array.from(
  { length: 20 },
  (_, i) =>
    `Chat ${i + 1}: ${
      ["AI Discussion", "Code Review", "Project Planning", "Bug Analysis"][
        i % 4
      ]
    }`
);
