import { fire } from "./firebase";
import { Observable } from "rxjs";
import firebase from "firebase";

export default class FirebaseServices {
  constructor() {
    this.db = fire.firestore();
    this.db.settings({
      timestampsInSnapshots: true
    });
    this.productsCollection = this.db.collection("shopItems");
    this.usersCollection = this.db.collection("users");
    this.wishlistCollection = this.db.collection("wishlist");
  }

  getProducts = () => {
    return new Observable(observer => {
      this.productsCollection.onSnapshot(querySnapshot => {
        const products = [];
        querySnapshot.forEach(doc => {
          const {
            category,
            description,
            name,
            picURL,
            price,
            quantity,
            remaining,
            brand
          } = doc.data();
          products.push({
            key: doc.id,
            doc, // DocumentSnapshot
            category,
            description,
            name,
            brand,
            picURL,
            price,
            quantity,
            remaining
          });
        });
        observer.next(products);
      });
    });
  };

  getWishlist = userId => {
    return new Observable(observer => {
      this.wishlistCollection
        .where("user_id", "==", userId)
        .onSnapshot(querySnapshot => {
          const products = [];
          const productKeys = [];
          querySnapshot.forEach(doc => {
            const productData = doc.data();
            products.push(productData);
          });
          products.forEach(prod => productKeys.push(prod.product_id));
          observer.next(productKeys);
        });
    });
  };

  getWishListItems = userId => {
    return new Observable(observer => {
      var wishlist = [];
      this.getWishlist(userId).subscribe(items => {
        wishlist.push(items);
        const products = [];
        items.forEach(item => {
          this.productsCollection
            .where(firebase.firestore.FieldPath.documentId(), "==", item)
            .onSnapshot(querySnapshot => {
              querySnapshot.forEach(doc => {
                const {
                  category,
                  description,
                  name,
                  picURL,
                  price,
                  quantity,
                  remaining,
                  brand
                } = doc.data();
                products.push({
                  key: doc.id,
                  doc,
                  category,
                  description,
                  name,
                  brand,
                  picURL,
                  price,
                  quantity,
                  remaining
                });
              });
              observer.next(products);
            });
        });
      });
    });
  };

  getUser = userId => {
    return new Observable(observer => {
      this.usersCollection
        .where(firebase.firestore.FieldPath.documentId(), "==", userId)
        .onSnapshot(querySnapshot => {
          var user = {};
          querySnapshot.forEach(doc => {
            const { name, coins } = doc.data();
            user = {
              name,
              coins,
              key: doc.id,
              doc
            };
          });
          observer.next(user);
        });
    });
  };

  addToWishlist = (productId, userId) => {
    var item = {
      product_id: productId,
      user_id: userId
    };
    this.wishlistCollection.add(item);
  };

  addProduct = product => {
    this.productsCollection.add(product);
  };

  deleteProduct = product => {
    this.productsCollection.doc(product.key).delete();
  };
}
