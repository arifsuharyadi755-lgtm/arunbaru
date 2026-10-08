import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { NewsArticle, UserComment } from '../types/news';
import { CoffeeDonation } from '../components/CoffeeTipModal';
import { AdSubmission } from '../types/advertising';
import { LogoSettings } from '../types/logoConfig';

const ARTICLES_COLLECTION = 'articles';
const COMMENTS_COLLECTION = 'comments';
const DONATIONS_COLLECTION = 'donations';
const ADS_COLLECTION = 'ads';
const SETTINGS_COLLECTION = 'settings';

export const firestoreService = {
  // --- ARTICLES ---
  async getArticles(): Promise<NewsArticle[]> {
    try {
      const snap = await getDocs(collection(db, ARTICLES_COLLECTION));
      const list: NewsArticle[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as NewsArticle);
      });
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, ARTICLES_COLLECTION);
      return [];
    }
  },

  subscribeArticles(onUpdate: (articles: NewsArticle[]) => void): () => void {
    return onSnapshot(collection(db, ARTICLES_COLLECTION), (snap) => {
      const list: NewsArticle[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as NewsArticle);
      });
      onUpdate(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, ARTICLES_COLLECTION);
    });
  },

  async saveArticle(article: NewsArticle): Promise<void> {
    const docPath = `${ARTICLES_COLLECTION}/${article.id}`;
    try {
      await setDoc(doc(db, ARTICLES_COLLECTION, article.id), article);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  async incrementArticleViews(articleId: string, currentViews: number): Promise<void> {
    const docPath = `${ARTICLES_COLLECTION}/${articleId}`;
    try {
      await updateDoc(doc(db, ARTICLES_COLLECTION, articleId), {
        viewsCount: currentViews + 1
      });
    } catch (err) {
      // Non-blocking view increment
      console.warn('View increment notice:', err);
    }
  },

  async incrementArticleComments(articleId: string, currentComments: number): Promise<void> {
    const docPath = `${ARTICLES_COLLECTION}/${articleId}`;
    try {
      await updateDoc(doc(db, ARTICLES_COLLECTION, articleId), {
        commentCount: currentComments + 1
      });
    } catch (err) {
      console.warn('Comment count increment notice:', err);
    }
  },

  async deleteArticle(articleId: string): Promise<void> {
    const docPath = `${ARTICLES_COLLECTION}/${articleId}`;
    try {
      await deleteDoc(doc(db, ARTICLES_COLLECTION, articleId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  },

  // --- COMMENTS ---
  subscribeComments(articleId: string, onUpdate: (comments: UserComment[]) => void): () => void {
    return onSnapshot(collection(db, COMMENTS_COLLECTION), (snap) => {
      const list: UserComment[] = [];
      snap.forEach(docSnap => {
        const item = docSnap.data() as UserComment;
        if (item.articleId === articleId) {
          list.push(item);
        }
      });
      list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      onUpdate(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, COMMENTS_COLLECTION);
    });
  },

  async addComment(comment: UserComment): Promise<void> {
    const docPath = `${COMMENTS_COLLECTION}/${comment.id}`;
    try {
      await setDoc(doc(db, COMMENTS_COLLECTION, comment.id), comment);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, docPath);
    }
  },

  async voteComment(commentId: string, upvotes: number, downvotes: number): Promise<void> {
    const docPath = `${COMMENTS_COLLECTION}/${commentId}`;
    try {
      await updateDoc(doc(db, COMMENTS_COLLECTION, commentId), {
        upvotes,
        downvotes
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, docPath);
    }
  },

  async deleteComment(commentId: string): Promise<void> {
    const docPath = `${COMMENTS_COLLECTION}/${commentId}`;
    try {
      await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  },

  // --- COFFEE DONATIONS ---
  subscribeDonations(onUpdate: (donations: CoffeeDonation[]) => void): () => void {
    return onSnapshot(collection(db, DONATIONS_COLLECTION), (snap) => {
      const list: CoffeeDonation[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as CoffeeDonation);
      });
      onUpdate(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, DONATIONS_COLLECTION);
    });
  },

  async addDonation(donation: CoffeeDonation): Promise<void> {
    const docPath = `${DONATIONS_COLLECTION}/${donation.id}`;
    try {
      await setDoc(doc(db, DONATIONS_COLLECTION, donation.id), donation);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, docPath);
    }
  },

  // --- ADVERTISEMENTS ---
  subscribeAds(onUpdate: (ads: AdSubmission[]) => void): () => void {
    return onSnapshot(collection(db, ADS_COLLECTION), (snap) => {
      const list: AdSubmission[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as AdSubmission);
      });
      onUpdate(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, ADS_COLLECTION);
    });
  },

  async addAdSubmission(ad: AdSubmission): Promise<void> {
    const docPath = `${ADS_COLLECTION}/${ad.id}`;
    try {
      await setDoc(doc(db, ADS_COLLECTION, ad.id), ad);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, docPath);
    }
  },

  async updateAdStatus(adId: string, status: 'review' | 'approved' | 'active'): Promise<void> {
    const docPath = `${ADS_COLLECTION}/${adId}`;
    try {
      await updateDoc(doc(db, ADS_COLLECTION, adId), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, docPath);
    }
  },

  // --- SITE SETTINGS (LOGO & EDITORIAL) ---
  subscribeLogoSettings(onUpdate: (settings: LogoSettings) => void): () => void {
    return onSnapshot(doc(db, SETTINGS_COLLECTION, 'logo'), (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as LogoSettings);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `${SETTINGS_COLLECTION}/logo`);
    });
  },

  async saveLogoSettings(settings: LogoSettings): Promise<void> {
    const docPath = `${SETTINGS_COLLECTION}/logo`;
    try {
      await setDoc(doc(db, SETTINGS_COLLECTION, 'logo'), settings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  subscribeEditorialProfile(onUpdate: (profile: any) => void): () => void {
    return onSnapshot(doc(db, SETTINGS_COLLECTION, 'editorial'), (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data());
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `${SETTINGS_COLLECTION}/editorial`);
    });
  },

  async saveEditorialProfile(profile: any): Promise<void> {
    const docPath = `${SETTINGS_COLLECTION}/editorial`;
    try {
      await setDoc(doc(db, SETTINGS_COLLECTION, 'editorial'), profile);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  }
};
