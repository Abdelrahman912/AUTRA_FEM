using System.Collections.Generic;

namespace AUTRA.Dtos
{
    public class PostProcessingDto
    {
        public List<NodalDisplacementDto> NodalDisplacements { get; set; }
        public List<ElementForceDto> ElementForces { get; set; }

    }
}
