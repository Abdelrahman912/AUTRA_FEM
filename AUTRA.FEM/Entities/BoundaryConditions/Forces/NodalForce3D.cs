using MathNet.Spatial.Euclidean;
using System.Numerics;

namespace AUTRA.FEM.Entities.BoundaryConditions.Forces
{
    public class NodalForce3D : NodalForce
    {
        public Vector3D Components { get; }


        public NodalForce3D(double fx, double fy, double fz)
        {
            Components = new Vector3D(fx, fy, fz);
        }

        public NodalForce3D()
        {
            Components = new Vector3D(0, 0, 0);
        }

        public override string ToString()
        {
            var Fx = Components.X;
            var Fy = Components.Y;
            var Fz = Components.Z;
            return $"Fx: {Fx}, Fy: {Fy}, Fz: {Fz}";
        }
    }
}
