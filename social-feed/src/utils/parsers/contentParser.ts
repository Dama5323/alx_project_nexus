// Utility functions for parsing mentions and hashtags

export interface ParsedContent {
  text: string;
  mentions: string[];
  hashtags: string[];
}

export const parseContent = (content: string): ParsedContent => {
  const mentions: string[] = [];
  const hashtags: string[] = [];
  
  // Extract mentions (@username)
  const mentionRegex = /@(\w+)/g;
  let mentionMatch;
  while ((mentionMatch = mentionRegex.exec(content)) !== null) {
    mentions.push(mentionMatch[1]);
  }
  
  // Extract hashtags (#topic)
  const hashtagRegex = /#(\w+)/g;
  let hashtagMatch;
  while ((hashtagMatch = hashtagRegex.exec(content)) !== null) {
    hashtags.push(hashtagMatch[1]);
  }
  
  return {
    text: content,
    mentions,
    hashtags
  };
};

export const highlightContent = (content: string): string => {
  let highlighted = content;
  
  // Highlight mentions
  highlighted = highlighted.replace(
    /@(\w+)/g,
    '<span class="mention" data-username="$1">@$1</span>'
  );
  
  // Highlight hashtags
  highlighted = highlighted.replace(
    /#(\w+)/g,
    '<span class="hashtag" data-tag="$1">#$1</span>'
  );
  
  return highlighted;
};

export const extractFirstHashtag = (content: string): string | null => {
  const hashtagRegex = /#(\w+)/;
  const match = content.match(hashtagRegex);
  return match ? match[1] : null;
};

export const extractFirstMention = (content: string): string | null => {
  const mentionRegex = /@(\w+)/;
  const match = content.match(mentionRegex);
  return match ? match[1] : null;
};