if (sessionStorage.getItem("userLogin") != "true") {
	window.location.href = "login.html";
}

var total = 0;
var count = 1;
var cart = [];
var productsUrl = "http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json";
var categoriesUrl = "http://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json";
var categories = getServiceData(categoriesUrl).value;
var products = getServiceData(productsUrl).value;
var productDate = new Date().toLocaleDateString(); //Use today's date for product
console.log(products);
showProducts(products);

function Product(id, image, price, productName, category, date, categoryId) {
	this.ProductID = id;
	this.image = image;
	this.UnitPrice = price;
	this.ProductName = productName;
	this.CategoryName = category;
	this.date = date;
	this.CategoryID = categoryId;
}

dropDownOpt(categories);

function dropDownOpt(categories) {

	for (var i in categories) {
		var option = document.createElement("option");
		option.setAttribute("value", categories[i].CategoryID);
		option.innerHTML = categories[i].CategoryName;
		document.getElementById("category").appendChild(option);
	}
	for (var i in categories) {
		var option = document.createElement("option");
		option.setAttribute("value", categories[i].CategoryID);
		option.innerHTML = categories[i].CategoryName;
		document.getElementById("categorySearch").appendChild(option);
	}
}

document.getElementById("btnAddBook").addEventListener("click", function () {
	enterProductData();
});

$(function () {
	$("#date").datepicker();
})

function enterProductData() {

	var imgUrl = document.getElementById("imgUrl").value.replace("C:\\fakepath\\", "img/");
	var price = document.getElementById("price").valueAsNumber;
	var title = document.getElementById("title").value;
	var categoryId = document.getElementById("category").value;
	var category = getCategoryNameByCategorId(categoryId, categories);
	var date = document.getElementById("date").value;

	var product = new Product(count, imgUrl, price, title, category, date, categoryId);

	if (document.getElementById("price").checkValidity() == false || document.getElementById("title").checkValidity() == false) {
		alert("Enter price and title");
	} else {
		drawProducts(product);
	}
	console.log(product);
}

function drawProducts(product, cart) {

	var catalog = document.getElementById("catalog");

	var divProduct = document.createElement("div");
	divProduct.setAttribute("class", "product");
	divProduct.id = product.ProductID;
	catalog.appendChild(divProduct);

	var pTitle = document.createElement("p");
	pTitle.innerHTML = product.ProductName;
	divProduct.appendChild(pTitle);

	var pCategory = document.createElement("p");
	pCategory.innerHTML = product.CategoryName;
	divProduct.appendChild(pCategory);

	var pDate = document.createElement("p");
	pDate.id = "date" + product.ProductID;
	pDate.innerHTML = product.date;
	divProduct.appendChild(pDate);

	var divImg = document.createElement("div");
	divImg.setAttribute("class", "divImg")
	divProduct.appendChild(divImg);

	var image = document.createElement("img");
	image.setAttribute("src", product.image);
	divImg.appendChild(image);

	if (cart) {
		var pAmount = document.createElement("p");
		pAmount.innerHTML = product.amount;
		pAmount.id = "cartAmount" + product.ProductID;
		divProduct.appendChild(pAmount);
	}

	var pPrice = document.createElement("p");
	pPrice.innerHTML = product.UnitPrice;
	pPrice.id = "price" + product.ProductID;
	divProduct.appendChild(pPrice);

	var label = document.createElement("label");
	label.innerHTML = "Amount:<br> <input id='amount" + product.ProductID + "' type='number' value='1' class='amount'>";
	divProduct.appendChild(label);

	if (!cart) {

		var btnDiv = document.createElement("div");
		btnDiv.setAttribute("class", "productBtn")
		divProduct.appendChild(btnDiv);

		var add = document.createElement("button");
		add.setAttribute("onclick", "add(this)");
		add.innerHTML = "+";
		add.id = "add" + product.ProductID;
		btnDiv.appendChild(add);

		var remove = document.createElement("button");
		remove.setAttribute("onclick", "remove(this)");
		remove.innerHTML = "-";
		remove.id = "remove" + product.ProductID;
		btnDiv.appendChild(remove);
	} else {
		var removeFromCart = document.createElement("button");
		removeFromCart.setAttribute("onclick", "removeItemFromCart(this)");
		removeFromCart.setAttribute("class", "removeFromCart");
		removeFromCart.innerHTML = "Remove";
		removeFromCart.id = "removeFromCart" + product.ProductID;
		divProduct.appendChild(removeFromCart);
	}
	count++;
}

function randomImg() {
	var random = Math.floor(Math.random() * 5) + 1;
	return "img/" + random + ".jpg";
}

function getCategoryNameByCategorId(categoryId, categories) {
	for (var i in categories) {
		if (categories[i].CategoryID == categoryId) {
			return categories[i].CategoryName;
		}
	}
}

function showProducts(products) {

	for (var i in products) {
		var product = new Product(products[i].ProductID, randomImg(), products[i].UnitPrice, products[i].ProductName, getCategoryNameByCategorId(products[i].CategoryID, categories), productDate, products[i].CategoryID);
		drawProducts(product);
	}
}

function getProductByProductId(productId, products) {

	for (var i in products) {
		if (products[i].ProductID == productId) {
			return products[i];
		}
	}
}

function add(btn) {

	var id = btn.id;
	id = id.slice(3);

	priceId = "price" + id;
	var price = new Number(document.getElementById(priceId).innerHTML);

	amountId = "amount" + id;
	var amount = document.getElementById(amountId).valueAsNumber;

	var product = getProductByProductId(id, products);

	var productInCart = false;
	for (var i in cart) {
		if (cart[i].ProductID == id) {
			cart[i].amount += amount;
			productInCart = true;
			break;
		}
	}
	if (!productInCart) {
		var newProduct = new Product(product.ProductID, randomImg(), product.UnitPrice, product.ProductName, getCategoryNameByCategorId(product.CategoryID, categories), productDate, product.CategoryID);

		newProduct.amount = amount;
		cart.push(newProduct);
	}
	total += price * amount;

	document.getElementById("total").innerHTML = "Total: " + total;
}

function cartIndex(productId, cart) {
	var result = -1;
	for (var i in cart) {
		if (cart[i].ProductID == productId) {
			return i;
		}
	}
	return result;
}

function remove(btn) {

	var id = btn.id;
	id = id.slice(6);

	var priceId = "price" + id;
	var price = new Number(document.getElementById(priceId).innerHTML);

	var amountId = "amount" + id;
	var amount = document.getElementById(amountId).valueAsNumber;

	var cartI = cartIndex(id, cart);

	if (cartI == -1 || amount > cart[cartI].amount) {
		var remove = 0;
		alert("Error");
	} else {
		for (var i = 0; i < amount; i++) {
			cart[cartI].amount -= amount;
			remove = price * amount;
			break;
		}
	}
	total -= remove;
	document.getElementById("total").innerHTML = "Total: " + total;
}

function ClearAllProducts() {
	$("#catalog").empty();
}

function showCart() {
	ClearAllProducts();
	for (var i in cart) {
		drawProducts(cart[i], true);
	}
}

function searchProducts() {

	var searchCategoryId = $("#categorySearch").val();
	var searchValue = $("#searchValue").val();

	if (searchCategoryId != 0) {

		ClearAllProducts();
		products1 = getProductsByCategoryId(searchCategoryId, products);

		if (searchValue != "") {

			products2 = getProductsBySearchValue(searchValue, products);
			showProducts(products2);
		} else {
			showProducts(products1);
		}
	} else {
		if (searchValue != "") {

			ClearAllProducts();
			products1 = getProductsBySearchValue(searchValue, products);
			showProducts(products1);
		} else {
			ClearAllProducts();
			showProducts(products);
		}
	}
}

$("#categorySearch").change(function () {
	searchProducts();
});

$("#searchValue").keyup(function () {
	searchProducts();
});

function showCatalog() {

	ClearAllProducts();
	showProducts(products);
}

function getProductsByCategoryId(categoryId, products) {

	var result = [];
	for (var i in products) {
		if (products[i].CategoryID == categoryId) {
			result.push(products[i]);
		}
	}
	return result;
}

function getProductsBySearchValue(searchParam, products) {

	var result = [];
	for (var i in products) {
		if (products[i].ProductName.toLowerCase().indexOf(searchParam) > -1 || getCategoryNameByCategorId(products[i].CategoryID, categories).toLowerCase().indexOf(searchParam) > -1) {
			result.push(products[i]);
		}
	}
	return result;
}

function removeItemFromCart(btn) {

	var id = btn.id;
	id = id.slice(14);
	priceId = "price" + id;

	var price = new Number(document.getElementById(priceId).innerHTML);


	var cartAmountId = "cartAmount" + id;
	var cartAmount = new Number(document.getElementById(cartAmountId).innerHTML);

	var inputAmountId = "amount" + id;
	var inputAmount = document.getElementById(inputAmountId).valueAsNumber;

	var cartI = cartIndex(id, cart);

	if (cartI == -1 || inputAmount > cart[cartI].amount) {
		var remove = 0;
		alert("Error");
	} else {
		for (var i = 0; i < cartAmount; i++) {
			cart[cartI].amount -= inputAmount;
			remove = price * inputAmount;
			cartAmount -= inputAmount;
			break;
		}
	}
	total -= remove;
	document.getElementById(cartAmountId).innerHTML = cartAmount;
	document.getElementById("total").innerHTML = "Total: " + total;
}

function getServiceData(url, username, password) {

	try {
		var result;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					result = JSON.parse(xmlhttp.response);
				} else {
					return false;
				}
			}
		}
		xmlhttp.open("GET", url, false, username, password);
		xmlhttp.send();
		return result;
	} catch (err) {
		return err;
	}
}
console.log(cart);
