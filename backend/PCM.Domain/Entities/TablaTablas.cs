namespace PCM.Domain.Entities;

public class TablaTablas
{
    public int TablaId { get; set; }
    public string NombreTabla { get; set; } = string.Empty;
    public string ColumnaId { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Valor { get; set; } = string.Empty;
    public short Orden { get; set; }
    public bool Activo { get; set; }
}
