let totalCompra = 0;

let menu = prompt("Selecciona un producto para agregar al carrito\n Playera: $15990 ARG\n1-T-shirt  $17990 ARG\n2-Sin mangas $15990 ARG\n3-Manga larga  $25990 ARG\n4-CropTop  $18990 ARG\n Posters\n5-16x9 pulgadas  $7500 ARG\n6-22x18 pulgadas  $11500\n7-45x28 pulgadas  $15500 ARG\n8-45x45 pulgadas  $19900 ARG\n0-Para finalizar compra");

while(menu != "0"){
    switch(menu){
        case "1":
            alert("T-shirt agregada $17990 ARG"); 
            sumarTotalCompra(17990);
            break;
        case "2": 
            alert("Playera sin mangas $15990 ARG");
            sumarTotalCompra(15990);
            break;
        case "3":
            alert("Playera manga larga agregada $25990 ARG");
            sumarTotalCompra(25990); 
            break;
        case "4":
            alert("Playera crop top agregada $18900 ARG");
            sumarTotalCompra(18990);
            break;
        case "5":
            alert("Poster de 16x9 pulgadas agregado $7500 ARG");
            sumarTotalCompra(7500);
            break;
        case "6":
            alert("Poster de 22x18 pulgadas agregado $11500 ARG");
            sumarTotalCompra(11500);
            break;
        case "7":
            alert("Poster de 45x28 pulgadas agregado $15500 ARG");
            sumarTotalCompra(15500);
            break;
        case "8":
                alert("Poster de 45x45 pulgadas agregado $19900 ARG");
                sumarTotalCompra(19900);
                break;
        default:
            alert("Codigo de producto incorrecto");
            break;
    }
    menu = prompt("Selecciona un producto para agregar al carrito\n Playeras:\n1-T-shirt  $17990 ARG\n2-Sin mangas $15.990 ARG\n3-Manga larga  $25990 ARG\n4-CropTop  $18990 ARG\n Posters\n5-16x9 pulgadas $7500 ARG\n6-22x18 pulgadas  $11500 ARG\n7-45x28 pulgadas  $15500 ARG\n8-45x45 pulgadas  $19900 ARG\n0-Para finalizar compra");
}

alert("Costo total de tu compra $" + totalCompra);

function sumarTotalCompra(precioProducto){
    totalCompra = totalCompra + precioProducto;
    console.log("Subtotal hasta el momento $" + totalCompra);
}