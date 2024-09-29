using AUTRA.FEM.Entities.BoundaryConditions.Forces;
using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Geometries;
using MathNet.Numerics.LinearAlgebra;
using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.FEM.Entities.Solver.DofHandler
{
    public class DofHandler1D : DofHandler
    {
        public DofHandler1D(SkeletonGeometry geometry) 
            : base(geometry)
        {
        }

        public override Matrix<double> GetElementStiffnessMatrix(int eleId)
        {
            return ((LineElement)_geometry.GetElementFromId(eleId)).K;
        }

        public override Vector<double> GetNodalForce(int nodeId)
        {
            return ((NodalForce3D)_geometry.GetNodeFromId(nodeId).NodalForce).Components.ToVector();
        }
    }
}
