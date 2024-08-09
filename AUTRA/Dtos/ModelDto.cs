using System.Collections.Generic;

namespace AUTRA.Dtos
{
    public class ModelDto
    {
        public List<NodeDto> Nodes { get; set; }
        public List<FrameElementDto> FrameElements { get; set; }
    }
}