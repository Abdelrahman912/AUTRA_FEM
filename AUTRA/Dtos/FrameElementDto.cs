namespace AUTRA.Dtos
{
    public class FrameElementDto
    {
        public int ElementId { get; set; }
        //public int Id { get; set; }
        //public string Prefix { get; set; }
        public int StartNodeId { get; set; }
        public int EndNodeId { get; set; }
        public double E { get; set; }
        public double A { get; set; }
        public  double Length { get; set; }
    }
}