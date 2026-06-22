export interface IVideoMember {
  memberId: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  videoCount: number;
}

export interface IVideoResponse {
  _id: string;
  memberId: string;
  url: string;
  videoId: string;
  thumbnail: string;
  createdAt?: string;
}
