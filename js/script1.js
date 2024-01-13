"use strict";

let calculatorConfig = {
	form: "form",
	table: "table",
	total: "total",
};

; (function (config) {

	let form = document.getElementById(config.form);
	let table = document.getElementById(config.table);
	let total = document.getElementById(config.total);
	let nameOfCommodity = form.querySelector("#name");
	let priceOfComodity = form.querySelector("#price");
	let amountOfComodyty = form.querySelector("#amount");
	let addButton = form.querySelector("#add");

	addButton.addEventListener("click", startCalculation);

	/*функция, проверящая на число */
	function isNumber(input) {
		/*проверка на число */
		const correctForNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		let count = 0;
		if (input[0] == '.' || input[input.length - 1] == '.' || input == '') {
			/*проверка на точки скраю и пустую ячейку */
			return false;
		}
		for (let index in input) {
			if (input[index] == '.') {
				count++;
			}
			if (!(input[index] in correctForNum)) {
				if (input[index] != '.') {
					return false;
				}
			}
			if (count > 1) {
				return false;
			}
		}
		return true;
	}

	/*функция, удаляющая строку таблицы, получая ее ячейку */
	function removeRow() {
		this.parentElement.remove();
		updateTotal();
	}

	/*обновить общую сумму */
	function updateTotal() {
		let elems = document.querySelectorAll(".cost");
		if (elems) {
			let sum = 0;
			for (let elem of elems) {

				sum += Number(elem.textContent);
			}
			total.textContent = sum;
		} else {
			total.textContent = "0";
		}

	}



	/*функция, позволяющая корректировать значения в таблице */
	function adjustValues(cell) {
		/*навешивание слушателя для корректировки значения */
		cell.addEventListener("click", function () {
			/*функция, возвращающая ячейке значение 
			(с проверкой)*/
			function returnValueToCell() {
				let parent = this.parentElement;
				let flag = parent.classList.contains("price");
				flag = flag || parent.classList.contains("amount");
				/*просто чтоб не было слишком длинной строки */
				if (flag) {
					/*проверка для требующий числовой тип данных полей */
					if (isNumber(this.value)) {
						parent.textContent = this.value;
					} else {
						parent.textContent = text;
						/*переменная в внешней функции, 
						содержащая старое значение */
					}
				}
				this.removeEventListener("change", returnValueToCell);
				this.removeEventListener("blur", returnValueToCell);
				this.remove();
				adjustThePriceInRow(parent);
			}

			/*функция корректирующая цену */
			function adjustThePriceInRow(td) {
				// скореектируй цену в строке
				let row = td.parentElement;
				let pr = row.querySelector(".price");
				let am = row.querySelector(".amount");
				let cost = row.querySelector(".cost");

				cost.textContent = Number(pr.textContent) *
					Number(am.textContent);
				updateTotal();
			}

			let input = document.createElement("input");
			/*создание input для корректировки значений */
			let text = this.textContent;
			/*нужно будет на случай, если введен не верный тип данных */
			input.value = text;
			this.textContent = '';
			this.append(input);
			input.focus();
			input.addEventListener("change", returnValueToCell);
			input.addEventListener("blur", returnValueToCell);
		});
	}

	/*функция, считывающая input */
	function reedInput() {
		let nameOf = nameOfCommodity.value;
		let priceOf = priceOfComodity.value;
		let amountOf = amountOfComodyty.value;
		let values = {
			n: nameOf,
			p: priceOf,
			a: amountOf,
		};
		return values;
	}

	/*функция очищающая input */
	function clearInput() {
		nameOfCommodity.value = '';
		priceOfComodity.value = '';
		amountOfComodyty.value = '';
		return true;
	}

	/*функция проверяющая input на корректрые данные */
	function correctInput() {
		let input = reedInput();
		let correct = input.n.length >= 3 &&
			isNumber(input.p) &&
			isNumber(input.a);
		return correct;
	}

	/*функция, создающая ячейку таблицы */
	function createCell(textOfCell, classOfCell) {
		let td = document.createElement("td");
		/*создана ячейка таблицы */
		td.textContent = textOfCell;
		td.classList.add(classOfCell);
		return td;
	}

	/*функция создающая строку таблицы */
	function createRow(values) {
		let tr = document.createElement("tr");
		/*создание строки таблицы */
		let td1 = createCell(values.n, "name");
		let td2 = createCell(values.p, "price");
		let td3 = createCell(values.a, "amount");

		let cost = values.p * values.a;

		let td4 = createCell(cost, "cost");
		let td5 = createCell("Удалить", "remove");

		adjustValues(td1);
		adjustValues(td2);
		adjustValues(td3);

		td5.addEventListener("click", removeRow);

		tr.append(td1);
		tr.append(td2);
		tr.append(td3);
		tr.append(td4);
		tr.append(td5);
		return tr;
	}

	/*функция запускающая запись в таблицу */
	function startCalculation() {
		if (correctInput()) {
			const row = createRow(reedInput())
			table.append(row)
			updateTotal();
			clearInput()
		} else {
			clearInput()
		}
	}

})(calculatorConfig)
