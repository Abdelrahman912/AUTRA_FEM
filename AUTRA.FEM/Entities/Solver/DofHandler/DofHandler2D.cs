using AUTRA.FEM.Entities.BoundaryConditions.Forces;
using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.FEValues;
using AUTRA.FEM.Entities.Geometries;
using MathNet.Numerics.LinearAlgebra;
using System.Collections.Generic;

namespace AUTRA.FEM.Entities.Solver.DofHandler
{
    public class DofHandler2D : DofHandler
    {

        #region private fields
        private readonly FEValues.FEValues _fevalues;
        private readonly Dictionary<int, CellValues> _cellValuesDict;
        #endregion

        public DofHandler2D(GridGeometry geometry, FEValues.FEValues fevalues) 
            : base(geometry)
        {
            _fevalues = fevalues;
            _cellValuesDict = new Dictionary<int, CellValues>();
        }

        public override Matrix<double> GetElementStiffnessMatrix(int eleId)
        {
            var quad = (Quadrilateral)_geometry.GetElementFromId(eleId);
            var cellValues = new CellValues(_fevalues, quad);
            _cellValuesDict.Add(eleId, cellValues);
            return cellValues.K;
        }

        public override Vector<double> GetNodalForce(int nodeId)
        {
            return ((NodalForce2D)_geometry.GetNodeFromId(nodeId).NodalForce).Components.ToVector();
        }

        public CellValues GetCellValues(int eleId)
        {
            if(_cellValuesDict.ContainsKey(eleId))
            {
                return _cellValuesDict[eleId];
            }else
            {
                throw new KeyNotFoundException("Element not found in the dictionary");
            }
        }

    }
}
