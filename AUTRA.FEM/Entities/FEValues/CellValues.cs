using AUTRA.FEM.Entities.Elements;
using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

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
            throw new NotImplementedException();
        }

        #endregion

    }
}
