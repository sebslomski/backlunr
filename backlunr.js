  Backbone.Collection.Lunr = Backbone.Collection.extend({
    lunroptions: {
        fields: []
    },

    initialize: function(models, options) {
        this.on('add', _.bind(this._lunrAdd, this));
        this.on('remove', _.bind(this._lunrRemove, this));
        this.on('change', _.bind(this._lunrChange, this));
    },

    _lunrInitialize: function() {
        var collection = this;

        this._lunrFields = [];

        this._lunrIndex = lunr(function() {
            var that = this;
            var opt;

            if (_.isFunction(collection.lunroptions)) {
                opt = collection.lunroptions(opt);
            } else {
                opt = _.extend({}, collection.lunroptions);
            }

            this.ref('cid');

            _.each(opt.fields, function(field) {
                collection._lunrFields.push(field.name);
                that.field(field.name, _.omit(field, ['isID', 'name']));
            });
        });
    },

    _lunrAdd: function(model) {
        this._lunrIndex.add(this._lunrPrepareModel(model));
    },

    _lunrRemove: function(model) {
      var _model;
      _model = model.toJSON();
      _model.cid = model.cid;
      this._lunrIndex.remove(_model);
    },

    _lunrChange: function(model) {
        this._lunrIndex.update(this._lunrPrepareModel(model));
    },

    _lunrPrepareModel: function(model) {
        var _model = model.toJSON();
        _model.cid = model.cid;

        _.each(this._lunrFields, function(field) {
            if (_.isUndefined(_model[field])) {
                _model[field] = '';
            } else {
                _model[field] = _model[field].toString();
            }
        });

        return _model;
    },

    reset: function(models, options) {
        var that = this;

        this._lunrInitialize();
        Backbone.Collection.prototype.reset.apply(this, arguments);

        this.each(function(model) {
            that._lunrAdd(model);
        });
    },

    processTerm: function(term) {
        return term;
    },

    search: function(term, raw) {
        var that = this;

        var _lunrRes = this._lunrIndex.search(this.processTerm(term));

        if (raw) {
            return _lunrRes;
        }

        var _res = _.map(_lunrRes, function(res) {
            return that.get(res.ref);
        });

        _res.toJSON = function(options) {
            return _.map(this, function(model) {
                return model.toJSON(options);
            });
        };

        return _res;
    }
});
