async function lineasFunc(archivo, tipo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (tipo == "ath") {
      let lineas;
      reader.onload = function (e) {
        lineas = e.target.result.split("\n");

        let lineasNum = [];

        for (let linea of lineas) {
          //console.log(console.log(`${linea[0]} ${!isNaN(linea[0])}`));
          if (!isNaN(linea[0]) && linea[0] !== "" && linea[0] !== "\r") {
            lineasNum.push(linea.split(" ")[0]);
          }
        }
        resolve(lineasNum);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(archivo);
    } else {
      reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: "array" });
        // Ahora puedes trabajar con el libro de trabajo (workbook)
        // Por ejemplo, puedes obtener la primera hoja del libro de trabajo
        let sheetNameList = workbook.SheetNames;
        let worksheet = workbook.Sheets[sheetNameList[0]];
        let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        let lineasNum = [];
        for (let linea of jsonData) {
          if (linea.length < 1) continue;
          if (linea.length > 16) {
            if (isNaN(linea[4])) continue;
            lineasNum.push(linea[4]);
          }
        }
        resolve(lineasNum);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(archivo);
    }
  });
}

export { lineasFunc }