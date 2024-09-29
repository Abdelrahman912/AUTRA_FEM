using AUTRA.FEM.Entities.Elements;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AUTRA.FEM.Entities.FEValues
{
    public class CellValues
    {
        #region private fields
        private FEValues _fevalues;
        private Quadrilateral _quad;
        private Lazy<List<GPCellValue>> _values;
        #endregion

        #region Properties
        public List<GPCellValue> Values => _values.Value;
        #endregion

        #region Constructors
        public CellValues(FEValues fevalues, Quadrilateral quad)
        {
            _fevalues = fevalues;
            _quad = quad;
            _values = new Lazy<List<GPCellValue>>(CalculateValues);
        }

        #endregion

        #region Methods

        private List<GPCellValue> CalculateValues()
        {
            var coords = _quad.Coordinates;
            _fevalues.Values.Select(fevalue =>
            {
                var dndxi = fevalue.dNdXi;
                var J = CalculateJacobian(dndxi, coords);
                var dndx = CalculateDNDX(J, dndxi);
                return new GPCellValue(fevalue.GaussPoint, dndx, J);
            });
            return new List<GPCellValue>();
        }


        private Matrix<double> CalculateJacobian(List<Vector2D> dndxis, List<Vector2D> coords)
        {
            var length = dndxis.Count;
            if(length != coords.Count)
            {
                throw new ArgumentException("The number of shape functions and coordinates must be the same");
            }
           var J =  Enumerable.Range(0, length).Aggregate(Matrix<double>.Build.Dense(2,2),(soFar,current) =>
            {
                var x = coords[current];
                var dndx = dndxis[current];
                var j = x.ToVector().OuterProduct(dndx.ToVector()); // refrence prof. Sauer notes
                return soFar + j;
            });
            return J;
        }

        private List<Vector2D> CalculateDNDX(Matrix<double> J, List<Vector2D> dndxis)
        {
            var invJ = J.Inverse().Transpose(); // refrence prof. Sauer notes
            var dndx = dndxis.Select(dndxi =>
            {
                var dndxiVector = dndxi.ToVector();
                var dndx = invJ.Multiply(dndxiVector);
                return new Vector2D(dndx[0], dndx[1]);
            }).ToList();
            return dndx;
        }

        public Matrix<double> CalculateK(Matrix<double> C, double h)
        {
            var K = Values.Select(value => value.CalculateK(C, h))
                         .Aggregate(Matrix<double>.Build.Dense(Values.First().B.ColumnCount, Values.First().B.ColumnCount), (soFar, current) => soFar + current);
            return K;
        }

        #endregion



    }
}
