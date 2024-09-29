using AUTRA.FEM.Entities.BoundaryConditions.Forces;
using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.FEValues;
using AUTRA.FEM.Entities.Geometries;
using MathNet.Numerics.LinearAlgebra;

namespace AUTRA.FEM.Entities.Solver.DofHandler
{
    public class DofHandler2D : DofHandler
    {

        #region private fields
        private readonly FEValues.FEValues _fevalues;
        #endregion

        public DofHandler2D(GridGeometry geometry, FEValues.FEValues fevalues) 
            : base(geometry)
        {
            _fevalues = fevalues;
        }

        public override Matrix<double> GetElementStiffnessMatrix(int eleId)
        {
            var quad = (Quadrilateral)_geometry.GetElementFromId(eleId);
            var cellValues = new CellValues(_fevalues, quad);
            return cellValues.K;
        }

        public override Vector<double> GetNodalForce(int nodeId)
        {
            return ((NodalForce2D)_geometry.GetNodeFromId(nodeId).NodalForce).Components.ToVector();
        }
    }
}
