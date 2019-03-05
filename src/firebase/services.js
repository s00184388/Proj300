import fire from "./firebase";
import { Observable } from "rxjs";
import firebase from "firebase";
import { when } from "q";

export default class FirebaseServices {
  constructor() {
    this.db = fire.firestore();
    this.brandImgdb = fire.storage().ref("BrandImages/");
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

  getAllProducts = () => {
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
  };

  getSponsoredProducts = () => {
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

  getAllWishlists = () => {
    return new Observable(observer => {
      this.wishlistsCollection.onSnapshot(querySnapshot => {
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
                    gainedCoins
                  });
                });
                observer.next(products);
              });
          });
          if (items.length == 0) {
            observer.next([]);
          }
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
              reject(new Error("*No email found"));
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
                  coins,
                  approved,
                  created
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
                  coins,
                  approved,
                  created
                };
                resolve(user);
              });
            }
          })
          .catch(err => {
            console.log("*Error getting documents", err);
            reject(err);
          });
      } else {
        reject(new Error("*No email found"));
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
                coins,
                approved,
                created
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
                coins,
                approved,
                created
              };
            });
            console.log(user);
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
                coins,
                approved,
                created
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
                coins,
                approved,
                created
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

  getAllUsers = () => {
    return new Observable(observer => {
      this.usersCollection.onSnapshot(querySnapshot => {
        var users = [];
        querySnapshot.forEach(doc => {
          const {
            firstName,
            lastName,
            role,
            email,
            deviceID,
            companyID,
            points,
            coins,
            approved,
            created
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
            coins,
            approved,
            created
          };
          users.push(user);
        });
        observer.next(users);
      });
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
              const {
                accessToken,
                refreshToken,
                api,
                distance,
                apiClientID,
                userID
              } = doc.data();
              device = {
                key: doc.id,
                doc,
                accessToken,
                api,
                apiClientID,
                distance,
                refreshToken,
                userID
              };
            });
            observer.next(device);
          });
      } else {
        observer.next({});
      }
    });
  };

  getDevicebyUser = userID => {
    return new Promise((resolve, reject) => {
      if (userID) {
        this.connectedDevicesCollection
          .where("userID", "==", userID)
          .onSnapshot(querySnapshot => {
            var device = {};
            querySnapshot.forEach(doc => {
              const {
                accessToken,
                refreshToken,
                api,
                distance,
                apiClientID,
                userID
              } = doc.data();
              device = {
                key: doc.id,
                doc,
                accessToken,
                api,
                apiClientID,
                distance,
                refreshToken,
                userID
              };
            });
            resolve(device);
          });
      } else {
        reject(new Error("No userID to search with"));
      }
    });
  };

  getDevices = () => {
    return new Observable(observer => {
      this.connectedDevicesCollection.onSnapshot(querySnapshot => {
        const devices = [];
        querySnapshot.forEach(doc => {
          const {
            api,
            apiClientID,
            distance,
            userID,
            accessToken,
            refreshToken
          } = doc.data();
          devices.push({
            key: doc.id,
            doc,
            api,
            apiClientID,
            distance,
            userID,
            accessToken,
            refreshToken
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
          .where("role", "==", "employee")
          .where("companyID", "==", companyID)
          .orderBy("coins")
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
              reject(new Error("Please check your inputs!"));
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
        reject(new Error("Please choose a company!"));
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
    var brandProductImageLocation = this.brandImgdb.child(product.picture.name);
    if (product) {
      brandProductImageLocation.put(product.picture).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url)=>{
          //console.log(url);
          product.picURL = url;
        }).then(() => {
          //console.log(product.picURL + " Firing the upload method after image uploaded");
            product.picture = null;
            this.productsCollection.add(product);
          });
        }
    )
  }

    /*  this.brandImagesCollection.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot){
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("upload is " + progress + "% done");
          }, function(error){
            console.log("upload error")
          },
          function(){*/

    /*brandProductImageLocation.put(product.picture).onSuccessListener(brandProductImageLocation.getDownloadURL()
    .then((url =>
      product.picURL = url),
      product.picture = null,
      this.productsCollection.add(product))
    .catch(err => {
      alert('Error at adding products! Check your inputs')
    }));*/

    /*this.brandImagesCollection.getDownloadURL()
      .then((url =>
        product.picURL = url),
        this.productsCollection.add(product))
      .catch(err => {
        alert('Error at adding products! Check your inputs')
      });*/
      alert("Cannot add product");
    }
  

  createUser = user => {
    return new Promise((resolve, reject) => {
      if (user) {
        this.usersCollection
          .add(user)
          .then(docRef => resolve(docRef.id))
          .catch(err => {
            alert("Auth:" + err);
            //console.log(err);
            reject(err);
          });
      } else {
        reject(new Error("No user given"));
      }
    });
  };

  createCompany = company => {
    return new Promise((resolve, reject) => {
      if (company) {
        this.companiesCollection
          .add(company)
          .then(docRef => resolve(docRef.id))
          .catch(err => {
            console.log(err);
            reject(err);
          });
      } else {
        reject(new Error("No company given"));
      }
    });
  };

  createBrand = brand => {
    return new Promise((resolve, reject) => {
      if (brand) {
        this.brandsCollection
          .add(brand)
          .then(docRef => resolve(docRef.id))
          .catch(err => {
            console.log(err);
            reject(err);
          });
      } else {
        reject(new Error("no brand given"));
      }
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

  deleteItemFromDashboard = _key => {
    if (_key) {
      this.productsCollection.doc(_key).delete();
    } else {
      console.log("Cannot delete product");
    }
  };

  editProduct = (p, _key) => {
    this.brandImagesCollection = this.brandImgdb.child(p.picture.name);
    if (p) {
      this.brandImagesCollection
        .put(p.picture)
        .then((p.picURL = this.brandImagesCollection.getDownloadURL()));
      p.picture = null;
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

      //console.log("updating:  " + _key);
    }
  };
}