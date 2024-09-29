using AUTRA.FEM.Entities.NumericalIntegration;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.FEM.Entities.FEValues
{
    public class GPCellValue
    {
        #region Properties
        public GaussPoint GaussPoint { get; }
        public List<Vector2D> dNdX { get; }
        public Matrix<double> J { get; set; }
        #endregion

        #region Constructors
        public GPCellValue(GaussPoint gaussPoint,  List<Vector2D> dndx, Matrix<double> j)
        {
            GaussPoint = gaussPoint;
            dNdX = dndx;
            J = j;
        }
        #endregion
    }
}
