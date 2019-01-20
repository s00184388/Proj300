import fire from './firebase'
import { Observable} from "rxjs";
import firebase from "firebase";

export default class FirebaseServices {
  constructor() {
    this.db = fire.firestore();
    this.db.settings({
      timestampsInSnapshots: true
    });
    this.productsCollection = this.db.collection("shopItems");
    this.usersTestCollection=this.db.collection("UserTest")
    this.usersCollection = this.db.collection("users");
    this.wishlistCollection = this.db.collection("wishlist");
  }

  getProducts = (field, query) => {
    return new Observable(observer => {
      this.productsCollection
      .where(field.toString(), "==", query)
      .onSnapshot(querySnapshot => {
        const products = [];
        querySnapshot.forEach(doc => {
          const {
            category, description, name, picURL, price, quantity, remaining, brand, sponsored
          } = doc.data();
          products.push({
            key: doc.id, doc, 
            category, description, name, picURL, price, quantity, remaining, brand, sponsored
          });
        });
        observer.next(products);
      });
    });
  };

  getBrandedProducts = (field, query) => {
    return new Observable(observer => {
      this.productsCollection
      .where("sponsored", "==", true)
      .where(field.toString(), "==", query)
      .orderBy("price")
      .onSnapshot(querySnapshot => {
        const products = [];
        querySnapshot.forEach(doc => {
          const {
            category, description, name, picURL, price, quantity, remaining, brand, sponsored
          } = doc.data();
          products.push({
            key: doc.id, doc, 
            category, description, name, picURL, price, quantity, remaining, brand, sponsored
          });
        });
        observer.next(products.reverse());
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
            const { name, coins, company, role } = doc.data();
            user = {
              name,
              coins,
              key: doc.id,
              doc,
              company, 
              role
            };
          });
          observer.next(user);
        });
    });
  };

  getEmployees = (companyName) => {
    return new Observable(observer => {
      this.usersCollection
      .orderBy("coins")
      .where("company", "==", companyName)
      .onSnapshot(querySnapshot => {
        const employees = [];
        querySnapshot.forEach(doc => {
          const {name, coins } = doc.data();
          employees.push({key: doc.id, doc, name, coins });
        });
        observer.next(employees.reverse());
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

  createUser= user=>{
    this.usersTestCollection.add(user)
  }

  deleteProduct = product => {
    this.wishlistCollection.where("product_id", "==", product.key)
      .get()
      .then(querySnapshot=>{
        querySnapshot.forEach(doc=>doc.ref.delete())
      });
  };
}
