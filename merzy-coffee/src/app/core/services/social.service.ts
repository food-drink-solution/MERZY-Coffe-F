import { Injectable } from '@angular/core';
import {
  MERZY_COMMENTS,
  MERZY_HIGHLIGHTS,
  MERZY_LINKS,
  MERZY_POSTS,
  MERZY_PROFILE,
  MerzyBusinessLinks,
  MerzyComment,
  MerzyHighlight,
  MerzySocialPost,
  MerzySocialProfile,
} from '../data/merzy-social';

@Injectable({ providedIn: 'root' })
export class SocialService {
  getProfile(): MerzySocialProfile {
    return MERZY_PROFILE;
  }

  getLinks(): MerzyBusinessLinks {
    return MERZY_LINKS;
  }

  getHighlights(): MerzyHighlight[] {
    return MERZY_HIGHLIGHTS;
  }

  getPosts(): MerzySocialPost[] {
    return MERZY_POSTS;
  }

  getFeaturedPosts(count: number): MerzySocialPost[] {
    return MERZY_POSTS.slice(0, count);
  }

  getComments(): MerzyComment[] {
    return MERZY_COMMENTS;
  }
}
