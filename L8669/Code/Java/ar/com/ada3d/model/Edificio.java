package ar.com.ada3d.model;

import java.io.Serializable;
import java.util.Date;

public class Edificio implements Serializable{
	private static final long serialVersionUID = 1L;
	
	public Edificio() {
		// Empty constructor
	}

	private String edf_codigo;
	private String edf_codigoNumerico;
	private String edf_codigoVisual;
	private String edf_direccion;
	private String edf_codigoPostal;
	private String edf_localidad;
	private String edf_provincia;
	private String edf_dependiente;
	private String edf_estadoProceso;
	private Date edf_fechaUltimaLiquidacion;
	private Integer edf_frecuenciaLiquidacion;
	private Date edf_fechaProximaLiquidacion;
	private String edf_porcentualTitulo;
	private String edf_cuit;
	private boolean edf_isReadMode;
	
	
	//TODO: private String edf_lockeo --> DocLock

		
	//Getters and Setters
	
	public String getEdf_codigo() {
		return edf_codigo;
	}
	public void setEdf_codigo(String edf_codigo) {
		this.edf_codigo = edf_codigo;
	}
	public String getEdf_codigoNumerico() {
		return edf_codigoNumerico;
	}
	public void setEdf_codigoNumerico(String edf_codigoNumerico) {
		this.edf_codigoNumerico = edf_codigoNumerico;
	}
	public String getEdf_codigoVisual() {
		return edf_codigoVisual;
	}
	public void setEdf_codigoVisual(String edf_codigoVisual) {
		this.edf_codigoVisual = edf_codigoVisual;
	}
	public String getEdf_direccion() {
		return edf_direccion;
	}
	public void setEdf_direccion(String edf_direccion) {
		this.edf_direccion = edf_direccion;
	}
	public String getEdf_codigoPostal() {
		return edf_codigoPostal;
	}
	public void setEdf_codigoPostal(String edf_codigoPostal) {
		this.edf_codigoPostal = edf_codigoPostal;
	}
	public String getEdf_localidad() {
		return edf_localidad;
	}
	public void setEdf_localidad(String edf_localidad) {
		this.edf_localidad = edf_localidad;
	}
	public String getEdf_provincia() {
		return edf_provincia;
	}
	public void setEdf_provincia(String edf_provincia) {
		this.edf_provincia = edf_provincia;
	}
	public String getEdf_adm_dependiente() {
		return edf_dependiente;
	}
	public void setEdf_adm_dependiente(String edf_adm_dependiente) {
		this.edf_dependiente = edf_adm_dependiente;
	}
	public String getEdf_estadoProceso() {
		return edf_estadoProceso;
	}
	public void setEdf_estadoProceso(String edf_estadoProceso) {
		this.edf_estadoProceso = edf_estadoProceso;
	}
	public Date getEdf_fechaUltimaLiquidacion() {
		return edf_fechaUltimaLiquidacion;
	}
	public void setEdf_fechaUltimaLiquidacion(Date edf_fechaUltimaLiquidacion) {
		this.edf_fechaUltimaLiquidacion = edf_fechaUltimaLiquidacion;
	}
	public Integer getEdf_frecuenciaLiquidacion() {
		return edf_frecuenciaLiquidacion;
	}
	public void setEdf_frecuenciaLiquidacion(Integer edf_frecuenciaLiquidacion) {
		this.edf_frecuenciaLiquidacion = edf_frecuenciaLiquidacion;
	}
	public Date getEdf_fechaProximaLiquidacion() {
		return edf_fechaProximaLiquidacion;
	}
	public void setEdf_fechaProximaLiquidacion(Date edf_fechaProximaLiquidacion) {
		this.edf_fechaProximaLiquidacion = edf_fechaProximaLiquidacion;
	}
	public String getEdf_porcentualTitulo() {
		return edf_porcentualTitulo;
	}
	public void setEdf_porcentualTitulo(String edf_porcentualTitulo) {
		this.edf_porcentualTitulo = edf_porcentualTitulo;
	}
	public String getEdf_cuit() {
		return edf_cuit;
	}
	public void setEdf_cuit(String edf_cuit) {
		this.edf_cuit = edf_cuit;
	}
	public void setEdf_isReadMode(boolean edf_isReadMode) {
		this.edf_isReadMode = edf_isReadMode;
	}
	public boolean isEdf_isReadMode() {
		return edf_isReadMode;
	}
	
	
}
