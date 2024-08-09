using MathNet.Spatial.Euclidean;
using System.Numerics;

namespace AUTRA.Dtos
{
    public class NodeDto
    {
        public int Id { get; set; }
        public Vector3D Position { get; set; }
        public Vector3D Force { get; set; }
        public ConstraintDto Constraint { get; set; }
    }
}