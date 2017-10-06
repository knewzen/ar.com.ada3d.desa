/*Esta libreria utiliza todas las funciones mas usadas y se utiliza en casi todas las paginas*/

/* Es un nombre corto para obtener la base de configuracion
 * Por cada base vamos a crear una funcion como esta
*/
function getDbCfg ():NotesDatabase {
	return getDbByKey ("Configuracion");
}


/* Obtiene del documento de configuracion el server y el path
 * Recibe como parametro la clave del documento a buscar que viene de la funcion anterior
 * Devuelve una base de datos
 */
function getDbByKey (strKey:String):NotesDatabase {
	var viewCfg:NotesView = session.getCurrentDatabase().getView("v.Sys.Cfg");
	var docCfg:NotesDocument = viewCfg.getDocumentByKey(strKey);
	var strServer:String = docCfg.getItemValueString("conf_server");
	var strPath:String = docCfg.getItemValueString("conf_path");
	return session.getDatabase(strServer, strPath, false);
}

/* Carga en una sessionScope la base que corresponde que obtiene de configuracion ********************/
function setDbsPathVariables () {
	setDbPath ("dbCfg", "Configuracion");
}
/*Continuacion de la funcion anterior*/
function setDbPath (strSesScopeVar:String, strKey:String) {
	var viewCfg:NotesView = session.getCurrentDatabase().getView("v.Sys.Cfg");
	var docCfg:NotesDocument = viewCfg.getDocumentByKey(strKey)
	var strServer:String = docCfg.getItemValueString("conf_server");
	var strPath:String = docCfg.getItemValueString("conf_path");
	var dbGet:NotesDatabase = session.getDatabase(strServer, strPath);
	sessionScope.put(strSesScopeVar, dbGet);
}

/*Busca en la base de configuracion una clave y devuelve un array*/
function getOpcionesClave(clave:String, result:String){ //@Return array
	var vOpciones:NotesView = getDbCfg().getView ("v.Sys.Opciones.Clave");
	var entryCol:NotesViewEntryCollection = vOpciones.getAllEntriesByKey(clave)
	var entryOpt:NotesViewEntry = entryCol.getFirstEntry();
	var arrOpts:Array = new Array ();
	while (entryOpt != null) {	
		switch(result){
		case "codigo":
			arrOpts.push(entryOpt.getDocument().getItemValueString("opt_Codigo_des"));
		case "descripcion":
			arrOpts.push(entryOpt.getDocument().getItemValueString("opt_Nombre_des"));
		case "alias":
			arrOpts.push(entryOpt.getDocument().getItemValueString("opt_Nombre_des") + "|" + entryOpt.getDocument().getItemValueString("opt_Codigo_des"));
			
		}
		//Recycle
		var tmpentry:NotesViewEntry = entryCol.getNextEntry(entryOpt);
		entryOpt.recycle();
		entryOpt = tmpentry;		
	};
	vOpciones.recycle();
	entryCol.recycle();
	return arrOpts;
}

function isUserActive():boolean{
	
}

/*Devuelve el documento de usuario de la base de administracion***************************/
function getUserDocument():NotesDocument {
	var viewMenuPorUsuario:NotesView = database.getView(getOpcionesClave("VIEW_USUARIOS_POR_ADMINISTRACION", "codigo")[0]);
	var docUsuario:NotesDocument = viewMenuPorUsuario.getDocumentByKey(context.getUser().getFullName());
	if (docUsuario != null){
		viewMenuPorUsuario.recycle();
		return docUsuario;
	}
}


/*Devuelve si es usuario de seguridad***********************************/
function isUSRSEG ():boolean {
	var docUsuario:NotesDocument = getUserDocument();
	if(docUsuario != null){
		var flagSeguridad:String = docUsuario.getItemValueString("usr_USRSEG_opt");
		if (flagSeguridad == "1"){
			docUsuario.recycle();
			return true;
		}
	}
	return false;
}


//Devuelve si el usuario pertenece al grupo enviado por parametro
function isUserGroupMember(groupName):boolean{
	var groups = context.getUser().getGroups().toArray();
	if(groups.length > 0) {
		for(var i=0; i<groups.length; i++) {
			if(groups[i] == groupName){
				return true;
			}
		}
	}
	return false
}

/*Recibe base, vista y clave y devuelve una colleccion*/
function getCollectionByKey(dbSource:NotesDatabase, vista:String, clave:String):NotesDocumentCollection{
	var view:NotesView = dbSource.getView(vista);
	var dc:DocumentCollection = view.getAllDocumentsByKey(clave);
	view.recycle();
	return dc
}

function setLog (doc_prm:NotesDocument, strLog_prm:String, strFieldName:String) {
	var strFullLog:String = @Now ().toString() + " - " + @RightBack(@Name ("[CN]", @UserName()),4);
	strFullLog += " - " + strLog_prm;
	
	var vecLog:java.util.Vector = doc_prm.getItemValue(strFieldName);
	vecLog.add(strFullLog);
	doc_prm.replaceItemValue(strFieldName, vecLog);
	
}


function getOptionLabel (strOptionKey:String, strOptionCode:String) {
		
	if (@Trim (strOptionKey).equals("") || @Trim (strOptionCode).equals("")) {
		return ("");
	}
	
	var vOpciones:NotesView = getDbCfg().getView ("v.Sys.Opciones.ClaveCodigo");
	var docOpt:NotesDocument = vOpciones.getDocumentByKey(strOptionKey + strOptionCode);
	return (docOpt.getItemValueString("opt_Nombre_des"));
	
}

function getHoySinHora ():java.util.Date {
	return getFechaSinHora (new java.util.Date());
}
function getFechaSinHora (dtFec:java.util.Date):java.util.Date {
	var intYear:int = dtFec.getFullYear();
	var intMonth:int = dtFec.getMonth();
	var intDay:int = dtFec.getDate();
	var dtFecSinHora:java.util.Date = new java.util.Date(intYear, intMonth, intDay, 0, 0, 0);
	return dtFecSinHora;
}

/* 
 * A partir de un alias y de un array, busca ese alias en el array
 * y devuelve el Label asociado.
 * 
 * strOptions_array - Array donde se espera encontrar en cada posición
 * un string con el Label a la izquierda y el Alias a la derecha, 
 * separados por un Pipe.  Ejemplo: [Frutillas|1], [Naranjas|2]
 * 
 * strAlias - El Alias a buscar
 * */
function getLabelFromAlias (strOptions_array:Array, strAlias:String):String {
	var strRight:String;
	
	for (i=0; i<strOptions_array.length; i++) {
		strRight = @Right(strOptions_array[i], "|");
		if (strRight.equals(strAlias)) { 
			return (@Left(strOptions_array[i], "|"));
		}
	}
	
	return "<NOT FOUND>";
}

/*
 * 
 * Recarga el XSP document con los campo del back end document. 
 * 
 * 
 * */
function updateXspWithDataSource (docXsp:NotesXspDocument) {
	//print ("vamos a actualizar");
	var vecItems:java.util.Vector = docXsp.getDocument().getItems();
	var itemAhogado:NotesItem;
	var strItemName:String;
	
	for (i=0; i<vecItems.size(); i++) {
		itemAhogado = vecItems.elementAt(i);
		strItemName = itemAhogado.getName ();
		//print ("valor: " + docXsp.getDocument().getItemValueString(strItemName));
		newValue = itemAhogado.getValues();
		docXsp.replaceItemValue(strItemName, newValue);
		//myComp = getComponent (strItemName);
		//if (myComp != null && newValue != null) myComp.setValue (newValue.elementAt(0));
	}	
}



function getYMD (dtFecha:NotesDateTime, strSep:String):String {
	//Get year month day
	
	var dtJs:Date;
	var intYear:int;
	var intMonth:int;
	var intDay:int;
	var strYear:String = "";
	var strMonth:String = "";
	var strDay:String = "";

	dtJs = dtFecha.toJavaDate();
	intYear = dtJs.getFullYear();
	intMonth = dtJs.getMonth() + 1; //Meses van de 0 a 11
	intDay = dtJs.getDate();
	
	strYear = intYear.toString();
	
	if (intMonth < 10) strMonth = "0";
	strMonth += intMonth.toString ();
	
	if (intDay < 10) strDay = "0";
	strDay += intDay.toString ();
	
	return (strYear + strSep + strMonth + strSep + strDay);
}



function getStatusLabel(codStatus:String){
	var vOpciones:NotesView = getDbCfg().getView ("v.Sys.vLK_EstadosOrdenados");
	var docOpt:NotesDocument = vOpciones.getDocumentByKey(codStatus);
	var result:String = docOpt.getItemValueString("est_Nombre_des");
	vOpciones.recycle();
	docOpt.recycle();
	return result;
}


function isStatusCheckFlag(codStatus:String, flag:String){
	//Busca si el estado tiene el check de emision
	var result:Boolean = false;
	var vEstados:NotesView = getDbCfg().getView ("v.Sys.LK_EstadosCodigo");
	var docEstado:NotesDocument = vEstados.getDocumentByKey(codStatus);
	if (docEstado != null){
		var marca:String = docEstado.getItemValueString(flag);
		if (marca == "1"){result = true}
	}
	if (vEstados != null){
		vEstados.recycle();	
	}
	if (docEstado != null){
		docEstado.recycle();	
	}
	return result
}



function getSelectedValueFromAlias( id ) {
	var ComboBox = getComponent( id );
	var ChildrenList:java.util.ListIterator;
	var result:String;
	ChildrenList = ComboBox.getChildren().listIterator();
	while (ChildrenList.hasNext()) {
		var Child = ChildrenList.next();
		/*** process computed / multiple values ***/
		if( typeof( Child ) == 'com.ibm.xsp.component.UISelectItemsEx' ){
			var hlp = Child.getValue();
			for( var i=0; i< hlp.length; i++ ){
				if(getComponent(id).getValue() == hlp[i].getValue()){
					result = hlp[i].getLabel();
				}
			}
		}
		/*** process single values ***/
		if( typeof( Child ) == 'com.ibm.xsp.component.UISelectItemEx' ){
			if(getComponent(id).getValue() == Child.getItemValue()){
				result = Child.getItemLabel();
			}
		}
	}
	return result;
}




function delay(millisecond){
	var startTime = new Date().getTime(); // get the current time
	while (new Date().getTime() < startTime + millisecond){ 
	}
	return true;
}


function StringToNotesDateTime(inputFormat:String, inputTimeStamp:String, outputFormat:String) {
	fecha = new java.text.SimpleDateFormat(outputFormat).format(new java.text.SimpleDateFormat(inputTimeStamp).parse(inputFormat))
	.toString();
	return session.createDateTime(fecha);
	
}

function evaluateFormula(strFormula_param:String, docTarget_param:NotesDocument){
	if (docTarget_param != null) return session.evaluate(strFormula_param, docTarget_param);
	else return session.evaluate(strFormula_param);
}

function evaluateFormulaXsp(strFormula_param:String, docTarget_param:NotesXspDocument){
	if (docTarget_param != null) return session.evaluate(strFormula_param, docTarget_param.getDocument(true));
	else return session.evaluate(strFormula_param);
}

function getFieldValueFromConfig(clave:String, fieldName:String){
	var dc:DocumentCollection = getCollectionByKey(getDbCfg(), "v.Sys.ODBC", clave);
	if(dc.getCount() < 1){return ""};
	var doc:NotesDocument = dc.getFirstDocument();	
	return doc.getItemValueString(fieldName);
}

function getFieldValueAsItemFromConfig(clave:String, fieldName:String):String{
	var dc:DocumentCollection = getCollectionByKey(getDbCfg(), "v.Sys.ODBC", clave);
	if(dc.getCount() < 1){return ""};
	var doc:NotesDocument = dc.getFirstDocument();	
	return doc.getItemValue(fieldName);
}

function getFieldValueFromViewConfig(vista:String, clave:String, fieldName:String){
	var dc:DocumentCollection = getCollectionByKey(getDbCfg(), vista, clave);
	if(dc.getCount() < 1){return ""};
	var doc:NotesDocument = dc.getFirstDocument();	
	return doc.getItemValueString(fieldName);
}



function wrapDocument(doc: NotesDocument): NotesXspDocument {
    return com.ibm.xsp.model.domino.wrapped.DominoDocument.wrap(doc.getParentDatabase().getFilePath(), doc, null, null, false, null);
}

function getList() {
	var dbConfig:NotesDatabase = getDbCfg();
    var nav: NotesViewNavigator = dbConfig.getView("v-treeview-clean").createViewNav();
    var entry: NotesViewEntry = nav.getFirst();
    if (entry != null) {
        var countLevel: Integer = 0;
        var curLevel: Integer;
        var list = "<div class=\'dropdown\'>";
        list = list + "<ul class=\'nav nav-pills\'>";
        list = list + "<li class=\'dropdown active\' id=\'accountmenu\'>";
        list = list + "<a class=\'dropdown-toggle\' data-toggle=\'dropdown\' href=\'#\'>Home</a";
        list = list + "<ul class=\'dropdown-menu\''>"
        while (entry != null) {
            var edoc: NotesDocument = entry.getDocument();
            entryValue = entry.getColumnValues().elementAt(1).toString();
            var col: NotesDocumentCollection = edoc.getResponses();
            curLevel = entry.getColumnIndentLevel();
            if (col.getCount() > 0) {
                //prep for new entry with response(s)
                var difLevel = countLevel - curLevel;
                var closure = ""
                for (var i = 0; i < (difLevel); i++) {
                    closure = closure + "</ul></li>"
                }
                list = list + closure;
                list = list + "<li class=\'dropdown-submenu\''>";
                list = list + "<a href=\'#\' tabindex=\”-1\'>" + entryValue + "</a>";
                list = list + "<ul id=\'" + entryValue + "\' class=\'dropdown-menu\'>";
                //increase counter
                countLevel = curLevel + 1;
            } else {
                if (curLevel == countLevel) {
                    list = list + "<li><a href=\''#\'>" + entryValue + "</a></li>";
                } else if (curLevel < countLevel) {
                    var difLevel = countLevel - curLevel;
                    var closure = ""
                    for (var i = 0; i < (difLevel); i++) {
                        closure = closure + "</ul></li>"
                    }
                    list = list + closure
                    countLevel = curLevel;
                } else {
                    //
                }
            }
            var tmpentry: NotesViewEntry = nav.getNext(entry);
            entry.recycle();
            entry = tmpentry;
        }
        //final closure, last entry could be response doc
        var closure = ""
        for (var i = 1; i < (countLevel); i++) {
            closure = closure + "</ul></li>"
        }
        list = list + closure
        //closure nav nav-list
        list = list + "</ul></li></ul></div>";
        //closure well sidebar-nav
        return list;
    } else {
        return "no documents found";
    }
}