import { lineasFunc } from "/diferencia-movi.github.io/js/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputATH = document.querySelector("#ath");
  const inputLocal = document.querySelector("#ath_local");
  const btnLeer = document.querySelector("#leer");

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  btnLeer.addEventListener("click", async (e) => {
    e.preventDefault();
    let archivoATH = inputATH.files[0];
    let archivoLocal = inputLocal.files[0];
    if (!archivoATH || !archivoLocal) {
      Toast.fire({
        icon: "warning",
        title: "Faltan archivos",
      });
      return false;
    }
    let registrosATHMayor = await lineasFunc(archivoATH, "ath");
    let registrosATHLocalMenor = await lineasFunc(archivoLocal, "ath_local");
    let registrosNoEnElXLS = [];
    let registrosNoEnElLST = [];

    for (let i of registrosATHMayor) {
      if (!registrosATHLocalMenor.includes(i) && i.trim() !== "") {
        registrosNoEnElXLS.push(i);
      }
    }

    for (let i of registrosATHLocalMenor) {
      if (!registrosATHMayor.includes(i)) {
        registrosNoEnElLST.push(i);
      }
    }
    let resultHTML = "";
    let registrosDiferentesNoXLS = "";
    let registrosDiferentesNoLST = "";
    if (registrosNoEnElXLS.length > 0) {
      registrosDiferentesNoXLS +=
        '<div class="border rounded d-flex flex-column alig-items-center mb-2 p-1"><h3 class="fs-6">Estan en el LST pero no en el XLS (Los tienen ellos pero nosotros no)</h3>';
      for (let i of registrosATHMayor) {
        if (!registrosATHLocalMenor.includes(i)) {
          if (i.trim() == "") continue;
          registrosDiferentesNoXLS += `<b>${i} <button class="btn btn-icono"><i class="fa-solid fa-copy"></i></button></b>\n`;
        }
      }
      registrosDiferentesNoXLS += "</div>";
      resultHTML += registrosDiferentesNoXLS;
    }

    if (registrosNoEnElLST.length > 0) {
      registrosDiferentesNoLST +=
        '<div class="border rounded d-flex flex-column alig-items-center p-1"><h3 class="fs-6">Estan en el XLS pero no en el LST (Los tenemos nosotros pero ellos no)</h3>';
      for (let i of registrosATHLocalMenor) {
        if (!registrosATHMayor.includes(i)) {
          if (i.trim() == "") continue;
          registrosDiferentesNoLST += `<b>${i} <button class="btn btn-icono"><i class="fa-solid fa-copy"></i></button></b>\n`;
        }
      }
      registrosDiferentesNoLST += "</div>";
      resultHTML += registrosDiferentesNoLST;
    }

    Swal.fire({
      title: registrosNoEnElXLS.length > 0 || registrosNoEnElLST > 0 ? `Referencias diferentes` : `No hay diferencias`,
      html: `${
        registrosNoEnElXLS.length > 0 || registrosNoEnElLST > 0
          ? resultHTML
          : ""
      }`,
      icon: registrosNoEnElXLS.length > 0 || registrosNoEnElLST > 0 ? "warning" : "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
      didOpen: () => {
        const btnCopy = document.querySelectorAll(".btn-icono");
        btnCopy.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            const tag_e = btn.parentElement;
            const tag_i = btn.querySelector("i");
            tag_i.classList.remove("fa-copy");
            tag_i.classList.add("fa-check");
            setTimeout(() => {
              tag_i.classList.remove("fa-check");
              tag_i.classList.add("fa-copy");
            }, 2000);
            navigator.clipboard.writeText(tag_e.textContent.trim());
          });
        });
      },
    }).then((result) => {
      inputATH.value = "";
      inputLocal.value = "";
    });
  });
});
