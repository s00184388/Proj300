import fire from "./firebase";
import { Observable } from "rxjs";
import firebase from "firebase";

export default class FirebaseServices {
  constructor() {
    this.db = fire.firestore();
    this.db.settings({
      timestampsInSnapshots: true
    });
    this.productsCollection = this.db.collection("Products");
    this.usersCollection = this.db.collection("Users");
    this.wishlistsCollection = this.db.collection("Wishlists");
    this.connectedDevicesCollection = this.db.collection("Connected_Devices");
    this.brandsCollection = this.db.collection("Brands");
    this.companiesCollection = this.db.collection("Companies");
  }

  getProducts = (field, query) => {
    return new Observable(observer => {
      if (field && query) {
        this.productsCollection
          .where("sponsored", "==", false)
          .where(field.toString(), "==", query)
          .onSnapshot(querySnapshot => {
            const products = [];
            querySnapshot.forEach(doc => {
              const {
                brandID,
                category,
                companyID,
                description,
                name,
                picture,
                price,
                stock,
                sponsored,
                tresholdPercentage
              } = doc.data();
              products.push({
                key: doc.id,
                doc,
                brandID,
                category,
                companyID,
                description,
                name,
                picture,
                price,
                stock,
                sponsored,
                tresholdPercentage
              });
            });
            observer.next(products);
          });
      } else {
        observer.next([]);
      }
    });
  };

  getAllProducts() {
    return new Observable(observer => {
      this.productsCollection.onSnapshot(querySnapshot => {
        const products = [];
        querySnapshot.forEach(doc => {
          const {
            brandID,
            category,
            companyID,
            description,
            name,
            picture,
            price,
            stock,
            sponsored,
            tresholdPercentage
          } = doc.data();
          products.push({
            key: doc.id,
            doc,
            brandID,
            category,
            companyID,
            description,
            name,
            picture,
            price,
            stock,
            sponsored,
            tresholdPercentage
          });
        });
        observer.next(products);
      });
    });
  }

  getSponsoredProducts = brandName => {
    return new Observable(observer => {
      this.productsCollection
        .where("sponsored", "==", true)
        .orderBy("price")
        .onSnapshot(querySnapshot => {
          const products = [];
          querySnapshot.forEach(doc => {
            const {
              brandID,
              category,
              companyID,
              description,
              name,
              picture,
              price,
              stock,
              sponsored,
              tresholdPercentage
            } = doc.data();
            products.push({
              key: doc.id,
              doc,
              brandID,
              category,
              companyID,
              description,
              name,
              picture,
              price,
              stock,
              sponsored,
              tresholdPercentage
            });
          });
          observer.next(products.reverse());
        });
    });
  };

  getBrandByName = brandName => {
    return new Promise((resolve, reject) => {
      if (brandName) {
        this.brandsCollection
          .where("name", "==", brandName)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
              reject(new Error("no company found"));
            } else {
              var company = {};
              querySnapshot.forEach(doc => {
                const {
                  adminUserID,
                  name,
                  picture,
                  address,
                  phoneNumber,
                  email,
                  description
                } = doc.data();
                company = {
                  key: doc.id,
                  doc,
                  adminUserID,
                  name,
                  picture,
                  address,
                  phoneNumber,
                  email,
                  description
                };
              });
              resolve(company);
            }
          });
      } else {
        reject(new Error("no company name"));
      }
    });
  };

  getBrandedProducts = (field, query) => {
    return new Observable(observer => {
      if (field && query) {
        this.productsCollection
          .where("sponsored", "==", true)
          .where(field.toString(), "==", query)
          .orderBy("price")
          .onSnapshot(querySnapshot => {
            const products = [];
            querySnapshot.forEach(doc => {
              const {
                brandID,
                category,
                companyID,
                description,
                name,
                picture,
                price,
                stock,
                sponsored,
                tresholdPercentage
              } = doc.data();
              products.push({
                key: doc.id,
                doc,
                brandID,
                category,
                companyID,
                description,
                name,
                picture,
                price,
                stock,
                sponsored,
                tresholdPercentage
              });
            });
            observer.next(products.reverse());
          });
      } else {
        observer.next([]);
      }
    });
  };

  getWishlist = userID => {
    return new Observable(observer => {
      if (userID) {
        this.wishlistsCollection
          .where("userID", "==", userID)
          .onSnapshot(querySnapshot => {
            const products = [];
            querySnapshot.forEach(doc => {
              const { userID, productID, gainedCoins } = doc.data();
              products.push({
                key: doc.id,
                doc,
                userID,
                productID,
                gainedCoins
              });
            });
            observer.next(products);
          });
      } else {
        observer.next([]);
      }
    });
  };

  getWishListItems = userID => {
    return new Observable(observer => {
      var wishlist = [];
      var gainedCoins = 0;
      if (userID) {
        this.getWishlist(userID).subscribe(items => {
          wishlist.push(items);
          const products = [];
          items.forEach(item => {
            gainedCoins = item.gainedCoins;
            this.productsCollection
              .where(
                firebase.firestore.FieldPath.documentId(),
                "==",
                item.productID
              )
              .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                  const {
                    brandID,
                    category,
                    companyID,
                    description,
                    name,
                    picture,
                    price,
                    stock,
                    sponsored,
                    tresholdPercentage
                  } = doc.data();
                  products.push({
                    key: doc.id,
                    doc,
                    brandID,
                    category,
                    companyID,
                    description,
                    name,
                    picture,
                    price,
                    stock,
                    sponsored,
                    tresholdPercentage,
                    gainedCoins: item.gainedCoins
                  });
                });
                observer.next(products);
              });
          });
        });
      } else {
        observer.next([]);
      }
    });
  };

  getUserByEmail = email => {
    return new Promise((resolve, reject) => {
      if (email) {
        this.usersCollection
          .where("email", "==", email)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              reject(new Error("no email found"));
            } else {
              snapshot.forEach(doc => {
                const {
                  firstName,
                  lastName,
                  role,
                  email,
                  deviceID,
                  companyID,
                  points,
                  coins
                } = doc.data();
                var user = {
                  key: doc.id,
                  doc,
                  firstName,
                  lastName,
                  role,
                  email,
                  deviceID,
                  companyID,
                  points,
                  coins
                };
                resolve(user);
              });
            }
          })
          .catch(err => {
            console.log("Error getting documents", err);
            reject(err);
          });
      } else {
        reject(new Error("bad email"));
      }
    });
  };

  getConnectedUser = () => {
    var user = firebase.auth().currentUser;
    var userEmail = "";
    if (user) {
      userEmail = user.email;
      console.log(userEmail);
    } else {
      console.log("no connected user found");
    }
    return new Observable(observer => {
      if (userEmail) {
        this.usersCollection
          .where("email", "==", userEmail)
          .onSnapshot(querySnapshot => {
            var user = {};
            querySnapshot.forEach(doc => {
              const {
                firstName,
                lastName,
                role,
                email,
                deviceID,
                companyID,
                points,
                coins
              } = doc.data();
              user = {
                key: doc.id,
                doc,
                firstName,
                lastName,
                role,
                email,
                deviceID,
                companyID,
                points,
                coins
              };
            });
            observer.next(user);
          });
      } else {
        console.log("no email to search with");
        observer.next({});
      }
    });
  };

  getUser = userID => {
    return new Observable(observer => {
      if (userID) {
        this.usersCollection
          .where(firebase.firestore.FieldPath.documentId(), "==", userID)
          .onSnapshot(querySnapshot => {
            var user = {};
            querySnapshot.forEach(doc => {
              const {
                firstName,
                lastName,
                role,
                email,
                deviceID,
                companyID,
                points,
                coins
              } = doc.data();
              user = {
                key: doc.id,
                doc,
                firstName,
                lastName,
                role,
                email,
                deviceID,
                companyID,
                points,
                coins
              };
            });
            observer.next(user);
          });
      } else {
        console.log("no email to search with");
        observer.next({});
      }
    });
  };

  getDevice = deviceID => {
    return new Observable(observer => {
      if (deviceID) {
        this.connectedDevicesCollection
          .where(firebase.firestore.FieldPath.documentId(), "==", deviceID)
          .onSnapshot(querySnapshot => {
            var device = {};
            querySnapshot.forEach(doc => {
              const { apiKey, calories, distance, steps } = doc.data();
              device = {
                key: doc.id,
                doc,
                apiKey,
                calories,
                distance,
                steps
              };
            });
            observer.next(device);
          });
      } else {
        observer.next({});
      }
    });
  };

  getDevices = () => {
    return new Observable(observer => {
      this.connectedDevicesCollection.onSnapshot(querySnapshot => {
        const devices = [];
        querySnapshot.forEach(doc => {
          const { apiKey, calories, distance, steps } = doc.data();
          devices.push({
            key: doc.id,
            doc,
            apiKey,
            calories,
            distance,
            steps
          });
        });
        observer.next(devices);
      });
    });
  };

  getBrand = brandID => {
    return new Observable(observer => {
      if (brandID) {
        this.brandsCollection
          .where(firebase.firestore.FieldPath.documentId(), "==", brandID)
          .onSnapshot(querySnapshot => {
            var brand = {};
            querySnapshot.forEach(doc => {
              const {
                adminUserID,
                name,
                picture,
                address,
                phoneNumber,
                email,
                description
              } = doc.data();
              brand = {
                key: doc.id,
                doc,
                adminUserID,
                name,
                picture,
                address,
                phoneNumber,
                email,
                description
              };
            });
            observer.next(brand);
          });
      } else {
        observer.next({});
      }
    });
  };

  getBrands = () => {
    return new Observable(observer => {
      this.brandsCollection.onSnapshot(querySnapshot => {
        const brands = [];
        querySnapshot.forEach(doc => {
          const {
            adminUserID,
            name,
            picture,
            address,
            phoneNumber,
            email,
            description
          } = doc.data();
          brands.push({
            key: doc.id,
            doc,
            adminUserID,
            name,
            picture,
            address,
            phoneNumber,
            email,
            description
          });
        });
        observer.next(brands);
      });
    });
  };

  getCompany = companyID => {
    return new Observable(observer => {
      if (companyID) {
        this.companiesCollection
          .where(firebase.firestore.FieldPath.documentId(), "==", companyID)
          .onSnapshot(querySnapshot => {
            var company = {};
            querySnapshot.forEach(doc => {
              const {
                adminUserID,
                name,
                picture,
                address,
                phoneNumber,
                email
              } = doc.data();
              company = {
                key: doc.id,
                doc,
                adminUserID,
                name,
                picture,
                address,
                phoneNumber,
                email
              };
            });
            observer.next(company);
          });
      }
    });
  };

  getCompanies = () => {
    return new Observable(observer => {
      this.companiesCollection.onSnapshot(querySnapshot => {
        const companies = [];
        querySnapshot.forEach(doc => {
          const {
            adminUserID,
            name,
            picture,
            address,
            phoneNumber,
            email
          } = doc.data();
          companies.push({
            key: doc.id,
            doc,
            adminUserID,
            name,
            picture,
            address,
            phoneNumber,
            email
          });
        });
        observer.next(companies);
      });
    });
  };

  getCompanyEmployees = companyID => {
    return new Observable(observer => {
      if (companyID) {
        this.usersCollection
          .orderBy("coins")
          .where("companyID", "==", companyID)
          .onSnapshot(querySnapshot => {
            const employees = [];
            querySnapshot.forEach(doc => {
              const {
                firstName,
                lastName,
                role,
                email,
                deviceID,
                companyID,
                points,
                coins
              } = doc.data();
              employees.push({
                key: doc.id,
                doc,
                firstName,
                lastName,
                role,
                email,
                deviceID,
                companyID,
                points,
                coins
              });
            });
            observer.next(employees.reverse());
          });
      } else {
        observer.next([]);
      }
    });
  };

  getCompanyByName = companyName => {
    return new Promise((resolve, reject) => {
      if (companyName) {
        this.companiesCollection
          .where("name", "==", companyName)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
              reject(new Error("no company found"));
            } else {
              var company = {};
              querySnapshot.forEach(doc => {
                const {
                  adminUserID,
                  name,
                  picture,
                  address,
                  phoneNumber,
                  email
                } = doc.data();
                company = {
                  key: doc.id,
                  doc,
                  adminUserID,
                  name,
                  picture,
                  address,
                  phoneNumber,
                  email
                };
              });
              resolve(company);
            }
          });
      } else {
        reject(new Error("no company name"));
      }
    });
  };

  addToWishlist = (productID, userID) => {
    if (productID && userID) {
      var item = {
        productID: productID,
        userID: userID,
        gainedCoins: 0
      };
      this.wishlistsCollection.add(item);
    } else {
      console.log("Cannot add to wishlist. productID or userID missing");
    }
  };

  addProduct = product => {
    if (product) {
      this.productsCollection.add(product);
    } else {
      console.log("Cannot add product");
    }
  };

  createUser = user => {
    return new Promise((resolve, reject) => {
      if (user) {
        this.usersCollection
          .add(user)
          .then(docRef => resolve(docRef.id))
          .catch(err => {
            console.log(err);
            reject(err);
          });
      } else {
        reject(new Error("No user given"));
      }
    });
  };

  createCompany = company => {
    if (company) {
      this.companiesCollection
        .add(company)
        .then(docRef => {
          return docRef.id;
        })
        .catch(err => console.log(err));
    } else {
      console.log("Cannot add company");
    }
  };

  createBrand = brand => {
    if (brand) {
      this.brandsCollection
        .add(brand)
        .then(docRef => {
          return docRef.id;
        })
        .catch(err => console.log(err));
    } else {
      console.log("Cannot add brand");
    }
  };

  deleteProduct = product => {
    if (product) {
      this.wishlistsCollection
        .where("productID", "==", product.key)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => doc.ref.delete());
        });
    } else {
      console.log("Cannot delete product");
    }
  };

  editProduct = (p, _key) => {
    if (p) {
      this.productsCollection.doc(_key).set(
        {
          category: p.category,
          description: p.description,
          name: p.name,
          picture: p.picture,
          price: p.price,
          stock: p.stock,
          tresholdPercentage: p.tresholdPercentage
        },
        { merge: true }
      );

      console.log("updating:  " + _key);
    }
  };
}
