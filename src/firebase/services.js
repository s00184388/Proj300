import fire from "./firebase";
import { Observable } from "rxjs";
import firebase from "firebase";
import { when } from "q";

export default class FirebaseServices {
  constructor() {
    this.db = fire.firestore();
    this.brandImgdb = fire.storage().ref("BrandImages/");
    this.companyImgdb = fire.storage().ref("CompanyImages/");
    //this.defaultImgb = fire.storage().ref("DefaultImages/");
    this.db.settings({
      timestampsInSnapshots: true
    });
    //firestore collection
    this.productsCollection = this.db.collection("Products");
    this.usersCollection = this.db.collection("Users");
    this.wishlistsCollection = this.db.collection("Wishlists");
    this.connectedDevicesCollection = this.db.collection("Connected_Devices");
    this.brandsCollection = this.db.collection("Brands");
    this.companiesCollection = this.db.collection("Companies");
  }

  //method for getting non-sponsored products with one condition
  getProducts = (field, query) => {
    //observable pattern for updating the products in real-time
    //as they are updated in the database
    return new Observable(observer => {
      //testing to see if data is valid
      if (field && query) {
        this.productsCollection
          .where("sponsored", "==", false)
          .where(field.toString(), "==", query)
          //getting the snapshot from firestore
          .onSnapshot(querySnapshot => {
            const products = [];
            //cycling through the snapshot and reading the documents
            querySnapshot.forEach(doc => {
              const {
                brandID,
                category,
                companyID,
                description,
                name,
                picURL,
                price,
                stock,
                sponsored,
                tresholdPercentage
              } = doc.data();
              //putting document properties in an array
              products.push({
                key: doc.id,
                doc,
                brandID,
                category,
                companyID,
                description,
                name,
                picURL,
                price,
                stock,
                sponsored,
                tresholdPercentage
              });
            });
            //returning the array of products
            observer.next(products);
          });
      } else {
        //if wrong data provided, return an empty array
        observer.next([]);
      }
    });
  };

  //a method for getting all products, no parameters required
  //note: this is the new JavaScript way of writing methods
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
            picURL,
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
            picURL,
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

  //method for getting all sponsored products and ordering them by price (descending)
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
              picURL,
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
              picURL,
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

  //method for getting sponsored products with a condition and ordering them in descending order
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
                picURL,
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
                picURL,
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

  //method for getting a user's wishlist
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

  //method for getting all wishlists
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

  //method for getting a user's wishlist products
  getWishListItems = userID => {
    return new Observable(observer => {
      var wishlist = [];
      var gainedCoins = 0;
      if (userID) {
        //calling the getWishlist method defined above
        this.getWishlist(userID).subscribe(items => {
          wishlist.push(items);
          const products = [];
          items.forEach(item => {
            gainedCoins = item.gainedCoins;
            //querying the products collection with the condition
            //that the product id is equal to the one already found in the wishlist
            this.productsCollection
              .where(
                firebase.firestore.FieldPath.documentId(),
                "==",
                item.productID
              )
              //then getting the product data
              .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                  const {
                    brandID,
                    category,
                    companyID,
                    description,
                    name,
                    picURL,
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
                    picURL,
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
          //if the wishlist was empty, the callback function is never called
          //so i call it gets called in here
          if (items.length == 0) {
            observer.next([]);
          }
        });
        //if the parameters are wrong (undefined or null)
      } else {
        observer.next([]);
      }
    });
  };

  //method for getting a user by email
  getUserByEmail = email => {
    //every query in the database have to return a promise, because javascript is asynchronous
    //this method uses promises and not observable because it is no need to update anything on change
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
                  brandID,
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
                  brandID,
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

  //method for getting the connected user
  getConnectedUser = () => {
    //calling the firebase method for the connected user (from this current session)
    var user = firebase.auth().currentUser;
    var userEmail = "";
    if (user) {
      userEmail = user.email;
    } else {
      console.log("no connected user found");
    }
    //returns user data as observable, by querying the users table with
    //with the condition of the email (firebase's method returns an object with email and an id
    //which is not the same as the one in the collection)
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
                brandID,
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
                brandID,
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

  //method for getting a user using the userID
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
                brandID,
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
                brandID,
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

  //method for getting all the users
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
            brandID,
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
            brandID,
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

  //method for getting device using device id
  getDevice = deviceID => {
    return new Observable(observer => {
      if (deviceID) {
        this.connectedDevicesCollection
          .where(firebase.firestore.FieldPath.documentId(), "==", deviceID)
          .onSnapshot(querySnapshot => {
            var device = {};
            querySnapshot.forEach(doc => {
              const {
                accessToken, //token for accessing API data, after granting access by the user
                refreshToken, //token for refreshing the accessToken after it expired
                api, //fitbit or strava
                distance, //last distance red from the api
                apiClientID, //user's api id
                userID //user id from users collection
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

  //method for getting a device by the userid (any user can have only one device)
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

  //method for getting all devices
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

  //method for getting a brand using brandID
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
                picURL,
                address,
                email,
                description
              } = doc.data();
              brand = {
                key: doc.id,
                doc,
                adminUserID,
                name,
                picURL,
                address,
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

  //method for getting all brands
  getBrands = () => {
    return new Observable(observer => {
      this.brandsCollection.onSnapshot(querySnapshot => {
        const brands = [];
        querySnapshot.forEach(doc => {
          const {
            adminUserID,
            name,
            picURL,
            address,
            email,
            description
          } = doc.data();
          brands.push({
            key: doc.id,
            doc,
            adminUserID,
            name,
            picURL,
            address,
            email,
            description
          });
        });
        observer.next(brands);
      });
    });
  };

  //method for getting a company by its id
  getCompany = companyID => {
    return new Observable(observer => {
      if (companyID) {
        this.companiesCollection
          .where(firebase.firestore.FieldPath.documentId(), "==", companyID)
          .onSnapshot(querySnapshot => {
            var company = {};
            querySnapshot.forEach(doc => {
              const { adminUserID, name, picURL, address, email } = doc.data();
              company = {
                key: doc.id,
                doc,
                adminUserID,
                name,
                picURL,
                address,
                email
              };
            });
            observer.next(company);
          });
      }
    });
  };

  //method for getting all companies
  getCompanies = () => {
    return new Observable(observer => {
      this.companiesCollection.onSnapshot(querySnapshot => {
        const companies = [];
        querySnapshot.forEach(doc => {
          const { adminUserID, name, picURL, address, email } = doc.data();
          companies.push({
            key: doc.id,
            doc,
            adminUserID,
            name,
            picURL,
            address,
            email
          });
        });
        observer.next(companies);
      });
    });
  };

  //method for getting a company's employees in descending order by coins
  getCompanyEmployees = companyID => {
    return new Observable(observer => {
      if (companyID) {
        //querying the users collection
        //and filtering the users by role and searching by user's companyId
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

  //method for getting a company by its name
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
                  picURL,
                  address,
                  email
                } = doc.data();
                company = {
                  key: doc.id,
                  doc,
                  adminUserID,
                  name,
                  picURL,
                  address,
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
    if (product) {
      if (product.sponsored) {
        if (product.picture != null) {
          var brandProductImageLocation = this.brandImgdb.child(
            product.picture.name
          );
          brandProductImageLocation.put(product.picture).then(snapshot => {
            snapshot.ref
              .getDownloadURL()
              .then(url => {
                product.picURL = url;
              })
              .then(() => {
                //console.log(product.picURL + " Firing the upload method after image uploaded");
                product.picture = null;
                this.productsCollection.add(product);
              });
          });
        } else {
          switch (product.category) {
            case "electronics":
              product.picURL =
                "https://firebasestorage.googleapis.com/v0/b/kudoshealth-2961f.appspot.com/o/DefaultImages%2FKudosElectronicIcon.png?alt=media&token=9322facb-467e-4379-b9a6-a5d447c8677d";
              this.productsCollection.add(product);
              break;
            case "sports":
              product.picURL =
                "https://firebasestorage.googleapis.com/v0/b/kudoshealth-2961f.appspot.com/o/DefaultImages%2FKudosSportsIcon.png?alt=media&token=25ab91bb-e9a7-4dd7-b15a-fb9c29afd37d";
              this.productsCollection.add(product);
              break;
            case "shoes":
              product.picURL =
                "https://firebasestorage.googleapis.com/v0/b/kudoshealth-2961f.appspot.com/o/DefaultImages%2FKudosShoeIcon.png?alt=media&token=0bd478f3-4af7-4add-b01c-0f47a3e7ef37";
              this.productsCollection.add(product);
              break;
            case "others":
              product.picURL =
                "https://firebasestorage.googleapis.com/v0/b/kudoshealth-2961f.appspot.com/o/DefaultImages%2FKudosOtherIcon.png?alt=media&token=43e9b891-9288-4143-a5a5-8de211ccce48";
              this.productsCollection.add(product);
              break;

            default:
              alert(
                "Error adding product" +
                  " This is the category " +
                  product.category
              );
              break;
          }
        }
      } else {
        if (product.picture != null) {
          var companyProductImageLocation = this.companyImgdb.child(
            product.picture.name
          );
          companyProductImageLocation.put(product.picture).then(snapshot => {
            snapshot.ref
              .getDownloadURL()
              .then(url => {
                //console.log(url);
                product.picURL = url;
              })
              .then(() => {
                //console.log(product.picURL + " Firing the upload method after image uploaded");
                product.picture = null;
                this.productsCollection.add(product);
              });
          });
        } else {
          switch (product.category) {
            case "Electronics":
              product.picURL =
                "https://firebasestorage.googleapis.com/v0/b/kudoshealth-2961f.appspot.com/o/DefaultImages%2FKudosElectronicIcon.png?alt=media&token=9322facb-467e-4379-b9a6-a5d447c8677d";
              this.productsCollection.add(product);
              break;
            case "Sports":
              product.picURL =
                "https://firebasestorage.googleapis.com/v0/b/kudoshealth-2961f.appspot.com/o/DefaultImages%2FKudosSportsIcon.png?alt=media&token=25ab91bb-e9a7-4dd7-b15a-fb9c29afd37d";
              this.productsCollection.add(product);
              break;
            case "Shoes":
              product.picURL =
                "https://firebasestorage.googleapis.com/v0/b/kudoshealth-2961f.appspot.com/o/DefaultImages%2FKudosShoeIcon.png?alt=media&token=0bd478f3-4af7-4add-b01c-0f47a3e7ef37";
              this.productsCollection.add(product);
              break;
            case "Others":
              product.picURL =
                "https://firebasestorage.googleapis.com/v0/b/kudoshealth-2961f.appspot.com/o/DefaultImages%2FKudosOtherIcon.png?alt=media&token=43e9b891-9288-4143-a5a5-8de211ccce48";
              this.productsCollection.add(product);
              break;

            default:
              alert("Error adding product");
              break;
          }
        }
      }
    }
  };

  setDefaultImage = pic => {};

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
                  picURL,
                  address,
                  email,
                  description
                } = doc.data();
                company = {
                  key: doc.id,
                  doc,
                  adminUserID,
                  name,
                  picURL,
                  address,
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
      this.productsCollection
        .doc(_key)
        .delete()
        .catch(err => console.log(err));
    } else {
      console.log("Cannot delete product");
    }
  };

  editProduct = (p, _key) => {
    if (p) {
      //method to check if the picture is being changed, else don't change the picture
      if (p.picture) {
        var brandProductImageLocation = this.brandImgdb.child(p.picture.name);
        var companyProductImageLocation = this.companyImgdb.child(
          p.picture.name
        );

        if (p.sponsored) {
          if (p.picture != null) {
            brandProductImageLocation.put(p.picture).then(snapshot => {
              snapshot.ref
                .getDownloadURL()
                .then(url => {
                  //console.log(url);
                  p.picURL = url;
                })
                .then(() => {
                  //console.log(product.picURL + " Firing the upload method after image uploaded");
                  p.picture = null;
                  return this.productsCollection.doc(_key).set(
                    {
                      category: p.category,
                      description: p.description,
                      name: p.name,
                      picURL: p.picURL,
                      price: p.price,
                      stock: p.stock,
                      tresholdPercentage: p.tresholdPercentage
                    },
                    { merge: true }
                  );
                  //this.productsCollection.add(product);
                });
            });
          } else {
            return this.productsCollection.doc(_key).set(
              {
                category: p.category,
                description: p.description,
                name: p.name,
                //picURL: p.picURL,
                price: p.price,
                stock: p.stock,
                tresholdPercentage: p.tresholdPercentage
              },
              { merge: true }
            );
          }
        }
      } else {
        if (p.picture != null) {
          companyProductImageLocation.put(p.picture).then(snapshot => {
            snapshot.ref
              .getDownloadURL()
              .then(url => {
                //console.log(url);
                p.picURL = url;
              })
              .then(() => {
                //console.log(product.picURL + " Firing the upload method after image uploaded");
                p.picture = null;
                return this.productsCollection.doc(_key).set(
                  {
                    category: p.category,
                    description: p.description,
                    name: p.name,
                    picURL: p.picURL,
                    price: p.price,
                    stock: p.stock,
                    tresholdPercentage: p.tresholdPercentage
                  },
                  { merge: true }
                );
                //console.log("updating:  " + _key);
              });
          });
        } else {
          return this.productsCollection.doc(_key).set(
            {
              category: p.category,
              description: p.description,
              name: p.name,
              //picURL: p.picURL,
              price: p.price,
              stock: p.stock,
              tresholdPercentage: p.tresholdPercentage
            },
            { merge: true }
          );
        }
      }
    }
  };
}
