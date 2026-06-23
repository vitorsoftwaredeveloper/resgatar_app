export interface IVideoResponse {
  _id: string;
  memberId: string;
  url: string;
  videoId: string;
  thumbnail: string;
  title?: string;
  createdAt?: string;
}

export interface IVideoFeedItem extends IVideoResponse {
  firstName: string;
  lastName: string;
  profileImage: string | null;
}
