import boto3
from botocore.exceptions import ClientError
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from typing import List, Dict, Any
from backend.app.config import settings

router = APIRouter(prefix="/evidences", tags=["Evidencias Digitales S3"])

@router.post("/upload/{codigo_qr}")
async def subir_evidencia_s3(codigo_qr: str, file: UploadFile = File(...)):
    """
    Sube una evidencia fotográfica o acta digital a Amazon S3.
    Utiliza las credenciales administradas por el IAM Role adjunto a la instancia EC2
    ('EcoRAEE-EC2-S3-BackendRole'), sin almacenar credenciales en el código.
    """
    try:
        s3 = boto3.client("s3", region_name=settings.AWS_REGION)
        file_key = f"evidencias/{codigo_qr}/{file.filename}"
        
        s3.upload_fileobj(
            file.file,
            settings.S3_BUCKET_NAME,
            file_key,
            ExtraArgs={"ContentType": file.content_type or "image/jpeg"}
        )
        
        # Generar Presigned URL segura (expira en 1 hora) para acceso controlado
        presigned_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.S3_BUCKET_NAME, "Key": file_key},
            ExpiresIn=3600
        )
        
        return {
            "status": "success",
            "mensaje": f"Evidencia digital para el dispositivo {codigo_qr} almacenada exitosamente en S3.",
            "bucket": settings.S3_BUCKET_NAME,
            "region": settings.AWS_REGION,
            "archivo": file.filename,
            "s3_key": file_key,
            "url_segura": presigned_url
        }
    except ClientError as e:
        error_msg = e.response.get("Error", {}).get("Message", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en AWS S3: {error_msg}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar archivo: {str(e)}"
        )

@router.get("/list/{codigo_qr}")
def listar_evidencias_s3(codigo_qr: str):
    """
    Lista las evidencias fotográficas almacenadas en S3 para un dispositivo y genera
    URLs presignadas seguras para su visualización.
    """
    try:
        s3 = boto3.client("s3", region_name=settings.AWS_REGION)
        prefix = f"evidencias/{codigo_qr}/"
        response = s3.list_objects_v2(Bucket=settings.S3_BUCKET_NAME, Prefix=prefix)
        
        evidencias = []
        if "Contents" in response:
            for obj in response["Contents"]:
                key = obj["Key"]
                filename = key.split("/")[-1]
                if not filename:
                    continue
                # Presigned URL para cada archivo
                url = s3.generate_presigned_url(
                    "get_object",
                    Params={"Bucket": settings.S3_BUCKET_NAME, "Key": key},
                    ExpiresIn=3600
                )
                evidencias.append({
                    "nombre": filename,
                    "s3_key": key,
                    "tamano_bytes": obj["Size"],
                    "ultima_modificacion": obj["LastModified"].isoformat(),
                    "url_visualizacion": url
                })
                
        return {
            "codigo_qr": codigo_qr,
            "total_evidencias": len(evidencias),
            "bucket": settings.S3_BUCKET_NAME,
            "evidencias": evidencias
        }
    except ClientError as e:
        error_msg = e.response.get("Error", {}).get("Message", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al consultar AWS S3: {error_msg}"
        )
