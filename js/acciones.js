// JavaScript Document
$(document).ready(function(e) 
{
  document.addEventListener("deviceready",function()
  {		 
	//se crea la base de datos Test es el nombre de la bd, 1.0 la version y 65535 el tamaño en bytes	
	var db = openDatabase ("Test", "1.0", "Base de Prueba", 65535);
	
	$("#Crear").bind ("click", function (event)
	 {			
		db.transaction (function (ejecutar) 
		  {
   			 var sql = "CREATE TABLE Clientes (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL, apellido VARCHAR(100) NOT NULL)";
    		ejecutar.executeSql (sql, undefined, function () 
			{ 
      			alert ("Tabla creada");
    		}, error);//executesql
 		 });//Ejecutar
	  });//Crear

	$("#Eliminar").bind ("click", function (event)
	 {
 		if (!confirm ("Borrar tabla?", "")) return;
  		db.transaction (function (transaction) 
		{
    	   var sql = "DROP TABLE Clientes";
    	   transaction.executeSql (sql, undefined,function ()
		   { 
      			alert ("Tabla Borrada");
    		} , error);//executesql
  		});//transaction
	 });//Eliminar

	function error (transaction, err) {
 	 alert ("Error de Base de Datos : " + err.message);
  	 return false;
	}//funcion error 
	
	$("#Insertar").bind ("click", function (event)
	{
 	   var v_nombre = $("#Nombre").val ();
 	   var v_apellido = $("#Apellido").val ();
  	   db.transaction (function (ejecutar) 
  		{
    		var sql = "INSERT INTO Clientes (nombre, apellido) VALUES (?, ?)";
    		ejecutar.executeSql (sql, [v_nombre, v_apellido], function ()
    		{ 
     		 alert ("Cliente Agregado");
    		}, error);//executesql
 		 });//ejecutar
	});  //insertar
	
	$("#Listar").bind ("click", function (event)
	 {
		 
 		db.transaction (function (ejecutar) 
  		 {
			
    	    var sql = "SELECT * FROM Clientes";
   		    ejecutar.executeSql (sql, undefined,function (ejecutar, resultado)
    	     {
				 
     		   var a_html = "<ul>";
      		  if (resultado.rows.length)
      			{
					
        	 		for (var i = 0; i < resultado.rows.length; i++) 
             		{
         	  		var fila = resultado.rows.item (i);
					var v_nombre = fila.nombre;
					var v_apellido=fila.apellido;
					var v_id=fila.id;
				     a_html += "<li data-icon=false id=" + v_id + " >";
					 a_html += "<a href=#>";
					 a_html += v_nombre + "&nbsp;" + v_apellido;
					  a_html += "</a>";
					  a_html += "</li>";
					 
        			}
      	   		}//if
     	 	  else
     	   		{
       		 		a_html += "<li> No hay clientes </li>";
      			}//else
         		a_html += "</ul>";
      
      		$("#listado").unbind ().bind ("pagebeforeshow", function ()
      			{
					//ubicate en el content del listado
          		  var $contenido = $("#listado div:jqmData(role=content)");
				  //agrega <ul> <li>     </li> .... </ul>
          		  $contenido.html (a_html);
          		  var $ul = $contenido.find ("ul");
				  //en lugar de viñetas salga en forma de lista
          		  $ul.listview ();
				  $("li").bind ("swiperight", function (event)
        			{
         			 var id_borrar = $(this).attr ("id");
          			 if (!id_borrar) return;
          				$(this).remove ();
           				db.transaction (function (ejecutar) 
          				{
            			  var SQL = "DELETE FROM Clientes WHERE id=?";
           				  ejecutar.executeSql (SQL, [id_borrar], function ()
            			 { 
              			   alert ("Cliente Borrado");
           				 }, error);//ejecutar
         		      });// transaction
       			   });// swipe right 
	          });//listado
       		$.mobile.changePage ($("#listado")); 
          }, error);//resultado
     	});//ejecutat
	});//listar
	
  }, false);//deviceready
});//document

